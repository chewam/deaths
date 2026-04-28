# Multi-stage build pour Next.js 14 en mode standalone.
# Image runtime ~150 MB (vs ~500 MB sans standalone).

# ── 1. Dépendances ───────────────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json yarn.lock ./
# --ignore-scripts : skip postinstall (notamment 'canvas' devDep qui demande
# cairo/pango natifs absents d'alpine, et qui ne sert qu'aux tests Jest).
RUN yarn install --frozen-lockfile --ignore-scripts

# ── 2. Build ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Token Sentry monté en BuildKit secret (jamais persisté dans une couche).
# Absent en local → upload sourcemaps skip avec warning, build OK.
RUN --mount=type=secret,id=sentry_auth_token,env=SENTRY_AUTH_TOKEN \
    yarn build

# ── 3. Runtime minimal ───────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# User non-root (recommandé par Next.js)
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Standalone bundle + assets statiques + public/
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]

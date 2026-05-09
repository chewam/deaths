import { FormattedMessage as Trans } from "react-intl"

import { Label } from "@/components/atoms"

const Footer = () => {
  const version = process.env.APP_VERSION || "0.0.0"
  const sha = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "dev"

  return (
    <footer className="border-border border-t px-12 py-3.5 flex items-center justify-between flex-wrap gap-4">
      <Label>
        <Trans
          id="Source"
          values={{
            link: (
              <a
                href="https://www.data.gouv.fr/fr/datasets/fichier-des-personnes-decedees"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-2 hover:text-text hover:underline"
              >
                data.gouv.fr
              </a>
            ),
          }}
        />
      </Label>
      <Label>
        v{version} ·{" "}
        <a
          href={`https://github.com/chewam/mortality/tree/${sha}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-2 hover:text-text hover:underline"
        >
          {sha.substring(0, 7)}
        </a>
      </Label>
    </footer>
  )
}

export default Footer

import NextHead from "next/head"
import useI18n from "@utils/i18n"

const Head = () => {
  const VERCEL_URL = process.env.VERCEL_URL
  const ANALYTICS_ID = process.env.ANALYTICS_ID

  const { f } = useI18n()

  return (
    <NextHead>
      <title>{f("title")}</title>
      <link rel="icon" href="/favicon.png" />
      <meta property="og:title" content={f("title")} />
      <meta
        name="description"
        property="og:description"
        content={f("description")}
      />
      {VERCEL_URL && (
        <meta
          property="og:image"
          content={`https://${VERCEL_URL}/screenshot.png`}
        />
      )}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      {ANALYTICS_ID && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${ANALYTICS_ID}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </>
      )}
    </NextHead>
  )
}

export default Head

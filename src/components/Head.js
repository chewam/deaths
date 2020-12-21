import NextHead from "next/head"
import { useIntl } from "react-intl"

const Head = () => {
  const VERCEL_URL = process.env.VERCEL_URL
  const ANALYTICS_ID = process.env.ANALYTICS_ID

  const intl = useIntl()

  return (
    <NextHead>
      <title>
        {intl.formatMessage({
          id: "title",
          defaultMessage: "Décès annuels en France",
        })}
      </title>
      <link rel="icon" href="/favicon.png" />
      <meta
        property="og:title"
        content={intl.formatMessage({
          id: "title",
          defaultMessage: "Décès annuels en France",
        })}
      />
      <meta
        name="description"
        property="og:description"
        content={intl.formatMessage({
          id: "description",
          defaultMessage:
            "Statistiques annuelles des décès en France de 2000 à nos jours, basées sur les données de l'INSEE.",
        })}
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

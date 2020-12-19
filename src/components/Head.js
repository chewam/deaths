import NextHead from "next/head"

const Head = () => {
  const VERCEL_URL = process.env.VERCEL_URL
  const ANALYTICS_ID = process.env.ANALYTICS_ID

  return (
    <NextHead>
      <title>Décès annuels en France</title>
      <link rel="icon" href="/favicon.png" />
      <meta property="og:title" content="Décès annuels en France" />
      <meta
        name="description"
        property="og:description"
        content="Statistiques annuelles des décès en France de 2010 à nos jours, basées sur les données de l'INSEE."
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

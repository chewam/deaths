import NextHead from "next/head"

const Head = (): JSX.Element => {
  const VERCEL_URL = process.env.NEXT_PUBLIC_VERCEL_URL
  const ANALYTICS_ID = process.env.NEXT_PUBLIC_ANALYTICS_ID

  return (
    <NextHead>
      <title>Mortalité en France</title>
      <meta name="robots" content="all" />
      <link rel="icon" href="/favicon.ico" />
      <link
        as="font"
        rel="preload"
        crossOrigin=""
        href="/fonts/Roboto-Regular.ttf"
      />
      <meta
        property="og:title"
        content="Les chiffres de la mortalité en France"
      />
      <meta
        name="description"
        property="og:description"
        content="Statistiques des décès en France de l'an 2000 à nos jours, basées sur les données de l'INSEE."
      />
      {VERCEL_URL && (
        <meta
          property="og:image"
          content={`https://${VERCEL_URL}/screenshot.png`}
        />
      )}
      <meta name="twitter:card" content="summary_large_image"></meta>
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

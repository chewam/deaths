import NextHead from "next/head"
import { useIntl } from "react-intl"

const Head = () => {
  const { formatMessage: fm } = useIntl()
  const VERCEL_URL = process.env.NEXT_PUBLIC_VERCEL_URL

  return (
    <NextHead>
      <title>{fm({ id: "Mortality in France" })}</title>
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
    </NextHead>
  )
}

export default Head

import Head from "next/head"
import { useIntl } from "react-intl"

const Custom404 = () => {
  const intl = useIntl()

  return (
    <>
      <Head>
        <title>
          {intl.formatMessage({
            id: "title",
            defaultMessage: "Décès annuels en France",
          })}
        </title>
        <meta
          name="description"
          property="og:description"
          content={intl.formatMessage({
            id: "description",
            defaultMessage:
              "Statistiques annuelles des décès en France de 2000 à nos jours, basées sur les données de l'INSEE.",
          })}
        />
      </Head>
      <h1>404 - Page Not Found</h1>
    </>
  )
}

export default Custom404

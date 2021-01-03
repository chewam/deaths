import Head from "next/head"
import useI18n from "@utils/i18n"

const Custom404 = () => {
  const { f } = useI18n()

  return (
    <>
      <Head>
        <title>{f("title")}</title>
        <meta
          name="description"
          property="og:description"
          content={f("description")}
        />
      </Head>
      <h1>404 - Page Not Found</h1>
    </>
  )
}

export default Custom404

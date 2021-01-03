import useI18n from "@utils/i18n"

const Header = () => {
  const { f } = useI18n()

  return (
    <header>
      <h1>
        {f("title")}
        <small>
          {f("sources")}
          {": "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.data.gouv.fr/fr/datasets/fichier-des-personnes-decedees"
          >
            data.gouv.fr
          </a>
        </small>
      </h1>
    </header>
  )
}

export default Header

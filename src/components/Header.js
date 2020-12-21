import { FormattedMessage } from "react-intl"

const Header = () => (
  <header>
    <h1>
      <FormattedMessage id="title" defaultMessage="Décès annuels en France" />
      <small>
        <FormattedMessage id="sources" defaultMessage="Sources INSEE" />:{" "}
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

export default Header

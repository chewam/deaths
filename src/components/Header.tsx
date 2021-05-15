import Menu from "./Menu"
import Link from "next/link"
import { FormattedMessage as Trans } from "react-intl"

const Header = (): JSX.Element => (
  <div className="header">
    <div className="wrapper">
      <h1>
        <Link href="/">
          <a>
            <Trans id="Mortality in France" />
          </a>
        </Link>
      </h1>
      <Menu />
    </div>
  </div>
)

export default Header

import Menu from "./Menu"
import Link from "next/link"
import { FormattedMessage as Trans } from "react-intl"

const Header = () => (
  <div className="header">
    <div className="wrapper">
      <h1>
        <Link href="/">
          <Trans id="Mortality in France" />
        </Link>
      </h1>
      <Menu />
    </div>
  </div>
)

export default Header

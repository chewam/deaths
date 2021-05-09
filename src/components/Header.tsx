import Menu from "./Menu"
import Link from "next/link"

const Header = (): JSX.Element => (
  <div className="header">
    <div className="wrapper">
      <h1>
        <Link href="/">
          <a>Mortalité en France</a>
        </Link>
      </h1>
      <Menu />
    </div>
  </div>
)

export default Header

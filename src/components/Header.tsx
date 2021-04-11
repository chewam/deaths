import Switch from "@/components/Switch"
import Menu from "./Menu"

const Header = (): JSX.Element => (
  <div className="header">
    <div className="wrapper">
      <h1>Mortalité en France</h1>
      <Menu />
    </div>
    <Switch />
  </div>
)

export default Header

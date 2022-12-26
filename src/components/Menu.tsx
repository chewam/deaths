import Link from "next/link"
import { useRouter } from "next/router"
import { FormattedMessage as Trans } from "react-intl"

const Menu = () => {
  const { route } = useRouter()
  const view = (route || "").substring(1)

  const items = [
    { label: "Vue d'Ensemble", view: "overview" },
    { label: "Comparaison", view: "comparison" },
    { label: "Répartition", view: "distribution" },
  ]

  return (
    <ul className="menu">
      {items.map((_item, i) => (
        <li key={i} className={`${view === items[i].view ? "active" : ""}`}>
          <Link href={`/${encodeURIComponent(items[i].view)}`}>
            <Trans id={items[i].view} />
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default Menu

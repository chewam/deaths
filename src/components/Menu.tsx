import Link from "next/link"
import { useRouter } from "next/router"
import { FormattedMessage as Trans } from "react-intl"

const Menu = (): JSX.Element => {
  const { route } = useRouter()
  const view = (route || "").substring(1)

  const items = [
    { label: "Vue d'Ensemble", view: "overview" },
    { label: "Comparaison", view: "comparison" },
    { label: "Répartition", view: "distribution" },
  ]

  return (
    <ul className="menu">
      {items.map((item, i) => (
        <li key={i} className={`${view === items[i].view ? "active" : ""}`}>
          <Link href={`/${encodeURIComponent(items[i].view)}`}>
            <a>
              <Trans id={items[i].view} />
            </a>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default Menu

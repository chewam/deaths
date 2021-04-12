import Link from "next/link"
import { useRouter } from "next/router"

const Menu = (): JSX.Element => {
  // const router = useRouter()
  const { route } = useRouter() || {}
  // const { route } = useRouter()
  const view = (route || "").substring(1)

  const items = [
    // { label: "Tableau de board", view: "" },
    { label: "Vue d'Ensemble", view: "" },
    { label: "Comparaison", view: "comparison" },
    { label: "Répartition", view: "mortality" },
    // { label: "Répartition", view: "distribution" },
    // { label: "Localisations", view: "locations" },
  ]

  return (
    <ul className="menu">
      {items.map((item, i) => (
        <li key={i} className={`${view === items[i].view ? "active" : ""}`}>
          <Link href={`/${encodeURIComponent(items[i].view)}`}>
            <a>{items[i].label}</a>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default Menu

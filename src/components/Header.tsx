import Link from "next/link"
import { useRouter } from "next/router"
import { FormattedMessage as Trans } from "react-intl"

import { Label, NavBtn, Pill } from "@/components/atoms"

const navItems = [
  { view: "overview", href: "/overview" },
  { view: "comparison", href: "/comparison" },
  { view: "distribution", href: "/distribution" },
] as const

const Header = () => {
  const { route, pathname, locale = "en" } = useRouter()
  const current = (route || "").substring(1)

  return (
    <header
      className={[
        "sticky top-0 z-20",
        "bg-bg/80 backdrop-blur-md",
        "border-border border-b",
        "px-12 py-4",
        "flex flex-wrap items-center justify-between gap-6",
      ].join(" ")}
    >
      <div className="flex items-baseline gap-3.5">
        <h1 className="font-display tracking-display text-text text-[22px] leading-none">
          <Link href="/">
            <Trans id="Mortality in France" />
          </Link>
        </h1>
        <Label>
          <Trans id="subtitle" />
        </Label>
      </div>

      <nav className="flex gap-1">
        {navItems.map(({ view, href }) => (
          <NavBtn key={view} href={href} active={current === view}>
            <Trans id={view} />
          </NavBtn>
        ))}
      </nav>

      <div className="flex items-center gap-1.5">
        <Pill
          href={pathname}
          locale="en"
          title="english"
          active={locale === "en"}
        >
          EN
        </Pill>
        <Pill
          href={pathname}
          locale="fr"
          title="français"
          active={locale === "fr"}
        >
          FR
        </Pill>
      </div>
    </header>
  )
}

export default Header

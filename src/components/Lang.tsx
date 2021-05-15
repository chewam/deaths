import Link from "next/link"
import { useRouter } from "next/router"

const Lang = (): JSX.Element => {
  const router = useRouter()
  const { locale, pathname } = router
  const lang = locale === "fr" ? "en" : "fr"

  return (
    <Link href={pathname} locale={lang}>
      <a className="lang">{lang}</a>
    </Link>
  )
}

export default Lang

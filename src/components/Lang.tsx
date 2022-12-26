import Link from "next/link"
import { useRouter } from "next/router"

const Lang = () => {
  const router = useRouter()
  const { locale, pathname } = router
  const lang = locale === "fr" ? "en" : "fr"
  const title = locale === "fr" ? "english" : "français"

  return (
    <Link href={pathname} locale={lang} className="lang" title={title}>
      {lang}
    </Link>
  )
}

export default Lang

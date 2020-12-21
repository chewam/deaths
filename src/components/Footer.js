import Link from "next/link"
import { useRouter } from "next/router"
const version = process.env.APP_VERSION || "0.0.0"
const sha = process.env.VERCEL_GITHUB_COMMIT_SHA || "dev"

const Footer = () => {
  const router = useRouter()
  const { locale } = router

  return (
    <footer>
      <div>Chewam © 2020</div>
      <div>
        <Link href="/" locale={locale === "fr" ? "en" : "fr"}>
          <a>{locale === "fr" ? "en" : "fr"}</a>
        </Link>{" "}
        - version {version} (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`https://github.com/chewam/deaths/tree/${sha}`}
        >
          {sha.substring(0, 7)}
        </a>
        )
      </div>
    </footer>
  )
}

export default Footer

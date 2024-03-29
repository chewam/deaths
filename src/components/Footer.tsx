import Lang from "@/components/Lang"
import { FormattedMessage as Trans } from "react-intl"

const Spacer = () => <span className="spacer">&nbsp;&nbsp;|&nbsp;&nbsp;</span>

const Footer = () => {
  const version = process.env.APP_VERSION || "0.0.0"
  const sha = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "dev"

  return (
    <footer>
      <div className="left">
        Chewam © 2020
        <Spacer />
        <Trans id="INSEE data" /> (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.data.gouv.fr/fr/datasets/fichier-des-personnes-decedees"
        >
          data.gouv.fr
        </a>
        )
      </div>

      <div className="right">
        <Lang />
        <Spacer />
        version {version} (
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

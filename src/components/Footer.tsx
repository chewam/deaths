import Lang from "@/components/Lang"
import Switch from "@/components/Switch"
import { FormattedMessage as Trans } from "react-intl"

const Footer = (): JSX.Element => {
  const version = process.env.APP_VERSION || "0.0.0"
  const sha = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "dev"

  return (
    <footer>
      <div>
        <span>
          Chewam © 2020 - <Trans id="INSEE data" />{" "}
        </span>
        (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.data.gouv.fr/fr/datasets/fichier-des-personnes-decedees"
        >
          data.gouv.fr
        </a>
        )
      </div>

      <div className="wrapper">
        <Switch />
        &nbsp; | &nbsp;
        <Lang />
        &nbsp; | &nbsp; version {version} (
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

const version = process.env.APP_VERSION || "0.0.0"
const sha = process.env.VERCEL_GITHUB_COMMIT_SHA || "dev"

const Footer = (): JSX.Element => {
  return (
    <footer>
      <div>
        <span>Chewam © 2020 - Données INSEE </span>(
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.data.gouv.fr/fr/datasets/fichier-des-personnes-decedees"
        >
          data.gouv.fr
        </a>
        )
      </div>

      <div>
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

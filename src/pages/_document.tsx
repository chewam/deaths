// import { Children } from "react"
// import { ServerStyleSheets } from "@material-ui/core/styles"
import Document, {
  // DocumentContext,
  // DocumentInitialProps,
  Html,
  Head,
  Main,
  NextScript,
} from "next/document"

class MyDocument extends Document {
  // static async getInitialProps(
  //   ctx: DocumentContext
  // ): Promise<DocumentInitialProps> {
  //   const sheets = new ServerStyleSheets()
  //   const originalRenderPage = ctx.renderPage

  //   ctx.renderPage = () =>
  //     originalRenderPage({
  //       enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
  //     })

  //   const initialProps = await Document.getInitialProps(ctx)

  //   return {
  //     ...initialProps,
  //     styles: [
  //       ...Children.toArray(initialProps.styles),
  //       sheets.getStyleElement(),
  //     ],
  //   }
  // }

  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument

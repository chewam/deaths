import Document, { Html, Head, Main, NextScript } from "next/document"

import { fontVariables } from "@/styles/fonts"

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" className={fontVariables}>
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

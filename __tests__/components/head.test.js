import { render } from "@testing-library/react"
import { IntlProvider } from "react-intl"
import Head from "@components/Head"
import fr from "@lang/fr.json"

describe("Head", () => {
  test("should create Head with image preview and analytics", () => {
    process.env.VERCEL_URL = "my.app.com"
    process.env.ANALYTICS_ID = "12345-AB"
    const { asFragment } = render(
      <IntlProvider locale="fr" messages={fr}>
        <Head />
      </IntlProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  test("should create Head without image preview and analytics", () => {
    const { asFragment } = render(
      <IntlProvider locale="fr" messages={fr}>
        <Head />
      </IntlProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })
})

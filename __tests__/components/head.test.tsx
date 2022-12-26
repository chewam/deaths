/**
 * @jest-environment jsdom
 */
import messages from "@/lang/fr.json"
import { IntlProvider } from "react-intl"
import { render } from "@testing-library/react"

import Head from "@/components/Head"

describe("Head", () => {
  test("should create Head with image preview and analytics", () => {
    process.env.VERCEL_URL = "my.app.com"
    process.env.ANALYTICS_ID = "12345-AB"
    const { asFragment } = render(
      <IntlProvider locale="fr" messages={messages}>
        <Head />
      </IntlProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  test("should create Head without image preview and analytics", () => {
    const { asFragment } = render(
      <IntlProvider locale="fr" messages={messages}>
        <Head />
      </IntlProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })
})

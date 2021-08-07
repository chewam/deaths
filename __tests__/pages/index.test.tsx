import messages from "@/lang/fr.json"
import { IntlProvider } from "react-intl"
import { render } from "@testing-library/react"

import Page from "../../src/pages/index"

test("Page snapshot: index", () => {
  jest.mock("next/router", () => ({
    useRouter() {
      return {
        locale: "fr",
        defaultLocale: "fr",
      }
    },
  }))

  const { asFragment } = render(
    <IntlProvider locale="fr" messages={messages}>
      <Page />
    </IntlProvider>
  )
  expect(asFragment()).toMatchSnapshot()
})

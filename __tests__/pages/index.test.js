import { render } from "@testing-library/react"
import { IntlProvider } from "react-intl"
import fr from "@lang/fr.json"

import Index from "../../src/pages/index"

const useRouter = jest.spyOn(require("next/router"), "useRouter")

test("should match snapshot", () => {
  useRouter.mockImplementationOnce(() => ({
    locale: "fr",
    defaultLocale: "fr",
  }))
  const { asFragment } = render(
    <IntlProvider locale="fr" messages={fr}>
      <Index />
    </IntlProvider>
  )
  expect(asFragment()).toMatchSnapshot()
})

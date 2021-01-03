import { render } from "@testing-library/react"
import { IntlProvider } from "react-intl"
import fr from "@lang/fr.json"

import Custom404 from "../../src/pages/404"

test("should match snapshot", () => {
  const { asFragment } = render(
    <IntlProvider locale="fr" messages={fr}>
      <Custom404 />
    </IntlProvider>
  )
  expect(asFragment()).toMatchSnapshot()
})

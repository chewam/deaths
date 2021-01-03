import { cleanup, render, fireEvent, screen } from "@testing-library/react"
import { IntlProvider } from "react-intl"
import fr from "@lang/fr.json"

import Years from "@components/years"

afterEach(cleanup)

test("should enable list item on click", () => {
  render(
    <IntlProvider locale="fr" messages={fr}>
      <Years />
    </IntlProvider>
  )
  const listItems = screen.getAllByRole("listitem")
  expect(listItems.length).toBeGreaterThanOrEqual(21)
  const lastItem = listItems[listItems.length - 1]
  expect(lastItem.classList.contains("disabled")).toBe(true)
  fireEvent.click(lastItem)
  expect(lastItem.classList.contains("disabled")).toBe(false)
})

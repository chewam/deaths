import { cleanup, render, fireEvent, screen } from "@testing-library/react"

import Years from "@components/years"

afterEach(cleanup)

test("should enable list item on click", () => {
  render(<Years />)
  const listItems = screen.getAllByRole("listitem")
  expect(listItems).toHaveLength(11)
  const lastItem = listItems[listItems.length - 1]
  expect(lastItem.classList.contains("disabled")).toBe(true)
  fireEvent.click(lastItem)
  expect(lastItem.classList.contains("disabled")).toBe(false)
})

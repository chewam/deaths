import { render } from "@testing-library/react"
import Page from "../../src/pages/index"

test("Page snapshot: index", () => {
  const { asFragment } = render(<Page />)
  expect(asFragment()).toMatchSnapshot()
})

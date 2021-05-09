import { render } from "@testing-library/react"
import Page from "../../src/pages/comparison"

test("Page snapshot: comparison", () => {
  const { asFragment } = render(<Page />)
  expect(asFragment()).toMatchSnapshot()
})

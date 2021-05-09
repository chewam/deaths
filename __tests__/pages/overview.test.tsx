import { render } from "@testing-library/react"
import Page from "../../src/pages/overview"

test("Page snapshot: overview", () => {
  const { asFragment } = render(<Page />)
  expect(asFragment()).toMatchSnapshot()
})

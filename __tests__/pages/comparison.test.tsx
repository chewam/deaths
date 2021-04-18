import { render } from "@testing-library/react"
import Page from "../../src/pages/comparison"

test("should match snapshot", () => {
  const { asFragment } = render(<Page />)
  expect(asFragment()).toMatchSnapshot()
})

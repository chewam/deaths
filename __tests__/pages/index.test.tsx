import { render } from "@testing-library/react"
import Page from "../../src/pages/index"

test("should match snapshot", () => {
  const { asFragment } = render(<Page />)
  expect(asFragment()).toMatchSnapshot()
})

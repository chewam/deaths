import { render } from "@testing-library/react"
import Page from "../../src/pages/distribution"

test("should match snapshot", () => {
  const { asFragment } = render(<Page />)
  expect(asFragment()).toMatchSnapshot()
})

import { render } from "@testing-library/react"

import Index from "../../src/pages/index"

test("should match snapshot", () => {
  const { asFragment } = render(<Index />)
  expect(asFragment()).toMatchSnapshot()
})

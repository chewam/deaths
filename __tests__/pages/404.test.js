import { render } from "@testing-library/react"

import Custom404 from "../../src/pages/404"

test("should match snapshot", () => {
  const { asFragment } = render(<Custom404 />)
  expect(asFragment(<Custom404 />)).toMatchSnapshot()
})

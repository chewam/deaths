import { render } from "@testing-library/react"

import Index from "../../src/pages/index"

test("should match snapshot", () => {
  const { asFragment } = render(<Index />)
  expect(asFragment(<Index />)).toMatchSnapshot()
})

// describe("Index page", () => {
//   test("should render header title", () => {
//     const { getByText } = render(<Index />)
//     const headerElement = getByText(/Décès annuels en France/)
//     expect(headerElement).toBeInTheDocument()
//   })

//   test("should render footer copyright", () => {
//     const { getByText } = render(<Index />)
//     const headerElement = getByText(/Chewam © 2020/)
//     expect(headerElement).toBeInTheDocument()
//   })
// })

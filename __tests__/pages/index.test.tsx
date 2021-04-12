import { render } from "@testing-library/react"
import Index from "../../src/pages/index"

test("should match snapshot", () => {
  const { asFragment } = render(<Index />)
  expect(asFragment()).toMatchSnapshot()
})

// pages/index.test.tsx

// import renderer from "react-test-renderer"
// import IndexPage from "../../src/pages/index"

// describe("Index page", () => {
//   it("should match the snapshot", () => {
//     const tree = renderer.create(<IndexPage />).toJSON()
//     expect(tree).toMatchSnapshot()
//   })
// })

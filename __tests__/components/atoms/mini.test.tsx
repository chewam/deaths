import { render, screen } from "@testing-library/react"
import Mini from "@/components/atoms/Mini"

describe("Mini", () => {
  test("renders label and value", () => {
    const { asFragment } = render(<Mini label="rate min" value="0.812%" />)
    expect(screen.getByText("rate min")).toBeInTheDocument()
    expect(screen.getByText("0.812%")).toBeInTheDocument()
    expect(asFragment()).toMatchSnapshot()
  })
})

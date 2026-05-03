import { render, screen } from "@testing-library/react"
import Label from "@/components/atoms/Label"

describe("Label", () => {
  test("renders children", () => {
    const { asFragment } = render(<Label>Source</Label>)
    expect(screen.getByText("Source")).toBeInTheDocument()
    expect(asFragment()).toMatchSnapshot()
  })
})

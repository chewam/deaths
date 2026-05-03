import { render, screen } from "@testing-library/react"
import Card from "@/components/atoms/Card"

describe("Card", () => {
  test("renders children", () => {
    const { asFragment } = render(
      <Card>
        <p>content</p>
      </Card>
    )
    expect(screen.getByText("content")).toBeInTheDocument()
    expect(asFragment()).toMatchSnapshot()
  })
})

import { fireEvent, render, screen } from "@testing-library/react"
import NavBtn from "@/components/atoms/NavBtn"

describe("NavBtn", () => {
  test("renders default state", () => {
    const { asFragment } = render(<NavBtn>Overview</NavBtn>)
    expect(screen.getByRole("button", { name: "Overview" })).toBeInTheDocument()
    expect(asFragment()).toMatchSnapshot()
  })

  test("applies active variant", () => {
    const { asFragment } = render(<NavBtn active>Year</NavBtn>)
    expect(asFragment()).toMatchSnapshot()
  })

  test("forwards onClick", () => {
    const onClick = vi.fn()
    render(<NavBtn onClick={onClick}>Comparison</NavBtn>)
    fireEvent.click(screen.getByRole("button", { name: "Comparison" }))
    expect(onClick).toHaveBeenCalledOnce()
  })
})

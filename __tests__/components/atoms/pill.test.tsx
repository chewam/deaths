import { fireEvent, render, screen } from "@testing-library/react"
import Pill from "@/components/atoms/Pill"

describe("Pill", () => {
  test("renders default state", () => {
    const { asFragment } = render(<Pill>EN</Pill>)
    expect(screen.getByRole("button", { name: "EN" })).toBeInTheDocument()
    expect(asFragment()).toMatchSnapshot()
  })

  test("applies active variant", () => {
    const { asFragment } = render(<Pill active>EN</Pill>)
    expect(asFragment()).toMatchSnapshot()
  })

  test("forwards onClick", () => {
    const onClick = vi.fn()
    render(<Pill onClick={onClick}>FR</Pill>)
    fireEvent.click(screen.getByRole("button", { name: "FR" }))
    expect(onClick).toHaveBeenCalledOnce()
  })
})

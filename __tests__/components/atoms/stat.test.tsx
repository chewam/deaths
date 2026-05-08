import { render, screen } from "@testing-library/react"
import Stat from "@/components/atoms/Stat"

describe("Stat", () => {
  test("renders label, value and unit", () => {
    const { asFragment } = render(
      <Stat label="Death rate" value="1.234" unit="%" />
    )
    expect(screen.getByText("Death rate")).toBeInTheDocument()
    expect(screen.getByText("1.234")).toBeInTheDocument()
    expect(screen.getByText("%")).toBeInTheDocument()
    expect(asFragment()).toMatchSnapshot()
  })

  test("renders with sub", () => {
    const { asFragment } = render(
      <Stat label="Total deaths" value="673,201" sub="vs avg 612,830" />
    )
    expect(screen.getByText("vs avg 612,830")).toBeInTheDocument()
    expect(asFragment()).toMatchSnapshot()
  })

  test("renders big variant", () => {
    const { asFragment } = render(
      <Stat label="Death rate" value="1.234" unit="%" big />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  test("renders positive delta as red with up arrow", () => {
    render(
      <Stat label="vs avg" value="1.234" delta={2.5} deltaLabel="vs avg" />
    )
    const delta = screen.getByText(/2\.50%/)
    expect(delta.textContent).toMatch(/↑/)
  })

  test("renders negative delta as green with down arrow", () => {
    render(
      <Stat label="vs avg" value="1.234" delta={-1.7} deltaLabel="vs avg" />
    )
    const delta = screen.getByText(/1\.70%/)
    expect(delta.textContent).toMatch(/↓/)
  })

  test("renders zero delta as neutral (em-dash, no up/down arrow)", () => {
    render(<Stat label="vs avg" value="1.234" delta={0} />)
    const delta = screen.getByText(/0\.00%/)
    expect(delta.textContent).toMatch(/—/)
    expect(delta.textContent).not.toMatch(/[↑↓]/)
  })

  test("colorize >0.5 marks value as danger", () => {
    const { container } = render(<Stat label="rate" value="1.5" colorize={1} />)
    expect(container.querySelector(".text-danger")).toBeInTheDocument()
  })
})

import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, test, vi } from "vitest"

import Trend from "@/components/charts/Trend"
import type { TrendYear } from "@/components/charts/trend-geometry"

const sample: TrendYear[] = [
  { year: 2000, rate: 0.9, deaths: 540_000, pop: 60_000_000 },
  { year: 2001, rate: 0.95, deaths: 550_000, pop: 61_000_000 },
  { year: 2002, rate: 1.0, deaths: 560_000, pop: 62_000_000 },
]

const labels = {
  mortalityRate: "Mortality rate",
  deathsCount: "Deaths",
  population: "Population",
}

const baseProps = {
  years: sample,
  chartType: "area" as const,
  hoveredYear: null,
  setHoveredYear: () => {},
  labels,
}

describe("Trend", () => {
  test("renders an svg with one visible point and one hit zone per year", () => {
    const { container } = render(<Trend {...baseProps} />)
    const svg = container.querySelector("svg")
    expect(svg).not.toBeNull()
    // 3 visible points (r=3) + 3 hit zones (r=12)
    expect(svg!.querySelectorAll("circle").length).toBe(6)
  })

  test("renders the average label with the computed average", () => {
    render(<Trend {...baseProps} />)
    expect(screen.getByText(/AVG 0\.95/)).toBeInTheDocument()
  })

  test("renders the y-axis tick labels for the rate domain", () => {
    render(<Trend {...baseProps} />)
    expect(screen.getByText("0.85")).toBeInTheDocument()
    expect(screen.getByText("0.90")).toBeInTheDocument()
    expect(screen.getByText("0.95")).toBeInTheDocument()
    expect(screen.getByText("1.00")).toBeInTheDocument()
  })

  test("renders the line path in both modes", () => {
    const { container, rerender } = render(
      <Trend {...baseProps} chartType="line" />
    )
    expect(container.querySelector('path[fill="none"]')).not.toBeNull()
    rerender(<Trend {...baseProps} chartType="area" />)
    expect(container.querySelector('path[fill="none"]')).not.toBeNull()
  })

  test("only renders the area gradient fill in area mode", () => {
    const { container, rerender } = render(
      <Trend {...baseProps} chartType="line" />
    )
    expect(container.querySelector('path[fill^="url(#"]')).toBeNull()
    rerender(<Trend {...baseProps} chartType="area" />)
    expect(container.querySelector('path[fill^="url(#"]')).not.toBeNull()
  })

  test("hovering a hit zone calls setHoveredYear with that year, leaving clears it", () => {
    const setHoveredYear = vi.fn()
    const { container } = render(
      <Trend {...baseProps} setHoveredYear={setHoveredYear} />
    )
    const hitZones = container.querySelectorAll('circle[r="12"]')
    expect(hitZones.length).toBe(3)
    fireEvent.mouseEnter(hitZones[1]!)
    expect(setHoveredYear).toHaveBeenCalledWith(2001)
    fireEvent.mouseLeave(hitZones[1]!)
    expect(setHoveredYear).toHaveBeenLastCalledWith(null)
  })

  test("shows a tooltip with the year + label rows when hoveredYear is set", () => {
    render(<Trend {...baseProps} hoveredYear={2001} />)
    expect(screen.getByText("2001")).toBeInTheDocument()
    expect(screen.getByText("Mortality rate")).toBeInTheDocument()
    expect(screen.getByText("Deaths")).toBeInTheDocument()
    expect(screen.getByText("Population")).toBeInTheDocument()
  })

  test("renders the crosshair only when a year is hovered", () => {
    const { container, rerender } = render(<Trend {...baseProps} />)
    expect(container.querySelector("line[stroke-dasharray='2 3']")).toBeNull()
    rerender(<Trend {...baseProps} hoveredYear={2001} />)
    expect(
      container.querySelector("line[stroke-dasharray='2 3']")
    ).not.toBeNull()
  })

  test("does not render a tooltip when hoveredYear is unknown", () => {
    render(<Trend {...baseProps} hoveredYear={1999} />)
    expect(screen.queryByText("Mortality rate")).toBeNull()
  })
})

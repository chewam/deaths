import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, test, vi } from "vitest"

import Monthly, { type MonthlyLabels } from "@/components/charts/Monthly"
import type {
  MonthlyEvent,
  MonthlyYear,
} from "@/components/charts/monthly-geometry"

const constMonthly = (v: number) => Array.from({ length: 12 }, () => v)

const sample: MonthlyYear[] = [
  { year: 2018, monthly: constMonthly(50_000) },
  { year: 2019, monthly: constMonthly(55_000) },
  { year: 2020, monthly: constMonthly(60_000) },
]

const labels: MonthlyLabels = {
  months: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  monthsLong: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  deathsCount: "Deaths",
}

const events: MonthlyEvent[] = [{ year: 2020, month: 2, label: "COVID" }]

const baseProps = {
  years: sample,
  selected: [] as number[],
  events,
  hovered: null,
  setHovered: () => {},
  labels,
}

describe("Monthly", () => {
  test("renders an svg with 12 month labels", () => {
    const { container } = render(<Monthly {...baseProps} mode="single" />)
    expect(container.querySelector("svg")).not.toBeNull()
    for (const m of labels.months) {
      expect(screen.getByText(m)).toBeInTheDocument()
    }
  })

  test("renders the y-axis tick labels (compact form, 0 to 80k)", () => {
    render(<Monthly {...baseProps} mode="single" />)
    expect(screen.getByText("0")).toBeInTheDocument()
    expect(screen.getByText("20K")).toBeInTheDocument()
    expect(screen.getByText("80K")).toBeInTheDocument()
  })

  test("single mode: highlights only the last year and ghosts the others", () => {
    const { container } = render(<Monthly {...baseProps} mode="single" />)
    // Ghost lines have opacity 0.18 (set via attribute)
    const ghosts = container.querySelectorAll('path[opacity="0.18"]')
    expect(ghosts.length).toBe(2) // 2018, 2019
    // Highlighted path uses var(--color-accent)
    const highlighted = container.querySelectorAll(
      'path[stroke="var(--color-accent)"]'
    )
    expect(highlighted.length).toBe(1)
  })

  test("single mode: renders 12 visible points + 12 hit zones for the highlighted year", () => {
    const { container } = render(<Monthly {...baseProps} mode="single" />)
    // visible points are r=2.5 (or r=5 when hovered)
    expect(container.querySelectorAll('circle[r="2.5"]').length).toBe(12)
    expect(container.querySelectorAll('circle[r="14"]').length).toBe(12)
  })

  test("single mode: renders event annotations", () => {
    render(<Monthly {...baseProps} mode="single" />)
    expect(screen.getByText("COVID")).toBeInTheDocument()
  })

  test("compare mode: renders one line per selected year + a legend, no events", () => {
    const { container } = render(
      <Monthly {...baseProps} mode="compare" selected={[2018, 2020]} />
    )
    // No ghost lines in compare mode
    expect(container.querySelectorAll('path[opacity="0.18"]').length).toBe(0)
    // Legend entries: each selected year is rendered in svg <text>
    expect(screen.getByText("2018")).toBeInTheDocument()
    expect(screen.getByText("2020")).toBeInTheDocument()
    // Events are not rendered in compare mode
    expect(screen.queryByText("COVID")).toBeNull()
  })

  test("compare mode: hit zones are rendered for each selected year", () => {
    const { container } = render(
      <Monthly {...baseProps} mode="compare" selected={[2018, 2020]} />
    )
    // 12 hit zones per series × 2 series = 24
    expect(container.querySelectorAll('circle[r="14"]').length).toBe(24)
  })

  test("hovering a hit zone calls setHovered with that {year, month}", () => {
    const setHovered = vi.fn()
    const { container } = render(
      <Monthly {...baseProps} mode="single" setHovered={setHovered} />
    )
    const hits = container.querySelectorAll('circle[r="14"]')
    expect(hits.length).toBe(12)
    fireEvent.mouseEnter(hits[2]!)
    expect(setHovered).toHaveBeenCalledWith({ year: 2020, month: 2 })
    fireEvent.mouseLeave(hits[2]!)
    expect(setHovered).toHaveBeenLastCalledWith(null)
  })

  test("renders the tooltip with month + year + value when hovered is set", () => {
    render(
      <Monthly
        {...baseProps}
        mode="single"
        hovered={{ year: 2020, month: 2 }}
      />
    )
    expect(screen.getByText(/March 2020/)).toBeInTheDocument()
    expect(screen.getByText("Deaths")).toBeInTheDocument()
    expect(screen.getByText("60,000")).toBeInTheDocument()
  })

  test("does not render a tooltip when hovered references an unknown year", () => {
    render(
      <Monthly
        {...baseProps}
        mode="single"
        hovered={{ year: 1999, month: 0 }}
      />
    )
    expect(screen.queryByText("Deaths")).toBeNull()
  })
})

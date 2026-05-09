import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, test, vi } from "vitest"

import OverviewGrid, {
  type OverviewGridLabels,
  type OverviewYear,
} from "@/components/views/OverviewGrid"

const labels: OverviewGridLabels = {
  mortalityRate: "Mortality rate",
  deathsCount: "Deaths",
  population: "Population",
  partial: "PARTIAL",
}

const buckets = [10, 12, 14, 18, 26, 38, 60, 95, 70, 25]

const mkYear = (year: number, rate: number): OverviewYear => ({
  year,
  rate,
  deaths: Math.round(rate * 600_000),
  pop: 65_000_000,
  buckets,
})

const sample: OverviewYear[] = [
  mkYear(2018, 0.913),
  mkYear(2019, 0.917),
  mkYear(2020, 0.992),
  mkYear(2021, 0.971),
]

const baseProps = {
  years: sample,
  labels,
  locale: "en",
}

describe("OverviewGrid", () => {
  test("renders one card per year", () => {
    const { container } = render(<OverviewGrid {...baseProps} />)
    const cards = container.querySelectorAll("[data-year]")
    expect(cards.length).toBe(sample.length)
  })

  test("sorts cards descending by year (newest first)", () => {
    const { container } = render(<OverviewGrid {...baseProps} />)
    const cards = container.querySelectorAll("[data-year]")
    const years = Array.from(cards).map((c) =>
      Number(c.getAttribute("data-year"))
    )
    expect(years).toEqual([2021, 2020, 2019, 2018])
  })

  test("shows the formatted mortality rate per year", () => {
    render(<OverviewGrid {...baseProps} />)
    expect(screen.getByText("0.913%")).toBeInTheDocument()
    expect(screen.getByText("0.992%")).toBeInTheDocument()
    expect(screen.getByText("0.971%")).toBeInTheDocument()
  })

  test("renders a trend-up badge when YoY rate jump exceeds +1%", () => {
    // 2020 (0.99) vs 2019 (0.91) → +8.8% → trend up
    const { container } = render(<OverviewGrid {...baseProps} />)
    const card2020 = container.querySelector('[data-year="2020"]')
    expect(card2020).not.toBeNull()
    expect(card2020!.querySelector('[data-trend="up"]')).not.toBeNull()
    expect(card2020!.querySelector('[data-trend="down"]')).toBeNull()
  })

  test("renders a trend-down badge when YoY rate drop exceeds -1%", () => {
    // 2021 (0.97) vs 2020 (0.99) → -2% → trend down
    const { container } = render(<OverviewGrid {...baseProps} />)
    const card2021 = container.querySelector('[data-year="2021"]')
    expect(card2021).not.toBeNull()
    expect(card2021!.querySelector('[data-trend="down"]')).not.toBeNull()
    expect(card2021!.querySelector('[data-trend="up"]')).toBeNull()
  })

  test("renders no trend badge when YoY rate change is within ±1%", () => {
    // 2019 (0.91) vs 2018 (0.91) → 0% → no trend
    const { container } = render(<OverviewGrid {...baseProps} />)
    const card2019 = container.querySelector('[data-year="2019"]')
    expect(card2019).not.toBeNull()
    expect(card2019!.querySelector("[data-trend]")).toBeNull()
  })

  test("renders no trend badge for the oldest year (no previous to compare)", () => {
    const { container } = render(<OverviewGrid {...baseProps} />)
    const card2018 = container.querySelector('[data-year="2018"]')
    expect(card2018).not.toBeNull()
    expect(card2018!.querySelector("[data-trend]")).toBeNull()
  })

  test("renders the partial badge and dash rate for the partial year", () => {
    const sampleWithPartial: OverviewYear[] = [...sample, mkYear(2022, 0.5)]
    const { container } = render(
      <OverviewGrid
        {...baseProps}
        years={sampleWithPartial}
        partialYear={2022}
      />
    )
    const card2022 = container.querySelector('[data-year="2022"]')
    expect(card2022).not.toBeNull()
    expect(card2022!.querySelector('[data-partial="true"]')).not.toBeNull()
    // rate is shown as "—", not the actual percentage
    expect(card2022!.textContent).toMatch(/—/)
    expect(card2022!.textContent).not.toMatch(/0\.5/)
  })

  test("calls onSelectYear with the year when a card is clicked", () => {
    const onSelectYear = vi.fn()
    const { container } = render(
      <OverviewGrid {...baseProps} onSelectYear={onSelectYear} />
    )
    const card2020 = container.querySelector('[data-year="2020"]')
    fireEvent.click(card2020!)
    expect(onSelectYear).toHaveBeenCalledWith(2020)
  })

  test("does not throw when onSelectYear is omitted and a card is clicked", () => {
    const { container } = render(<OverviewGrid {...baseProps} />)
    const card2020 = container.querySelector('[data-year="2020"]')
    expect(() => fireEvent.click(card2020!)).not.toThrow()
  })

  test("renders 10 mini-donut arcs per year (the 10 age buckets)", () => {
    const { container } = render(<OverviewGrid {...baseProps} />)
    for (const y of sample.map((s) => s.year)) {
      const card = container.querySelector(`[data-year="${y}"]`)
      expect(card).not.toBeNull()
      const arcs = card!.querySelectorAll("svg path[data-bucket]")
      expect(arcs.length).toBe(10)
    }
  })

  test("formats numbers using the provided locale", () => {
    // FR uses non-breaking space as thousands separator; EN uses comma.
    // 0.992 * 600_000 = 595_200
    const { rerender, container } = render(<OverviewGrid {...baseProps} />)
    const card2020En = container.querySelector('[data-year="2020"]')
    expect(card2020En!.textContent).toMatch(/595,200/)

    rerender(<OverviewGrid {...baseProps} locale="fr" />)
    const card2020Fr = container.querySelector('[data-year="2020"]')
    expect(card2020Fr!.textContent).not.toMatch(/595,200/)
    expect(card2020Fr!.textContent).toMatch(/595/)
    expect(card2020Fr!.textContent).toMatch(/200/)
  })
})

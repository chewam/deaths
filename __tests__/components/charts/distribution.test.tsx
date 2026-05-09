import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, test, vi } from "vitest"

import Distribution, {
  type DistributionLabels,
} from "@/components/charts/Distribution"
import type { DistributionYear } from "@/components/charts/distribution-geometry"

const AGE_BUCKETS = [
  "0-9",
  "10-19",
  "20-29",
  "30-39",
  "40-49",
  "50-59",
  "60-69",
  "70-79",
  "80-89",
  "90+",
]

const labels: DistributionLabels = {
  deathsCount: "Deaths",
  mortalityRate: "Mortality rate",
  ageBuckets: AGE_BUCKETS,
}

const mkYear = (
  year: number,
  rate: number,
  m = 50,
  f = 50
): DistributionYear => ({
  year,
  buckets: [
    1_000, 2_000, 3_000, 5_000, 10_000, 30_000, 60_000, 90_000, 60_000, 20_000,
  ],
  rate,
  m,
  f,
})

const sample: DistributionYear[] = [
  mkYear(2018, 0.91),
  mkYear(2019, 0.92),
  mkYear(2020, 0.99),
]

const baseProps = {
  years: sample,
  gender: "all" as const,
  hovered: null,
  setHovered: () => {},
  labels,
}

describe("Distribution", () => {
  test("renders an svg with one stacked-bar group per year", () => {
    const { container } = render(<Distribution {...baseProps} />)
    const svg = container.querySelector("svg")
    expect(svg).not.toBeNull()
    const groups = container.querySelectorAll("g[data-year]")
    expect(groups.length).toBe(sample.length)
  })

  test("renders 10 stacked rects per year (the 10 age buckets)", () => {
    const { container } = render(<Distribution {...baseProps} />)
    for (const y of sample.map((s) => s.year)) {
      const group = container.querySelector(`g[data-year="${y}"]`)
      expect(group).not.toBeNull()
      // bucket rects are the colored ones (not the transparent hit zone)
      const bucketRects = group!.querySelectorAll(
        'rect[fill]:not([fill="transparent"])'
      )
      expect(bucketRects.length).toBe(10)
    }
  })

  test("renders the mortality rate overlay path", () => {
    const { container } = render(<Distribution {...baseProps} />)
    const ratePath = container.querySelector(
      'path[stroke="var(--color-danger)"]'
    )
    expect(ratePath).not.toBeNull()
    expect(ratePath!.getAttribute("d")).toMatch(/^M /)
  })

  test("renders the year tick labels on the x-axis", () => {
    render(<Distribution {...baseProps} />)
    expect(screen.getByText("2018")).toBeInTheDocument()
    expect(screen.getByText("2020")).toBeInTheDocument()
  })

  test("renders the legend with all 10 age bucket labels", () => {
    render(<Distribution {...baseProps} />)
    for (const label of AGE_BUCKETS) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
  })

  test("renders the axis labels (deaths + mortality rate)", () => {
    render(<Distribution {...baseProps} />)
    expect(screen.getByText("Deaths")).toBeInTheDocument()
    expect(screen.getByText("Mortality rate")).toBeInTheDocument()
  })

  test("dims other years' bars when one year is hovered (controlled)", () => {
    const { container } = render(<Distribution {...baseProps} hovered={2019} />)
    const group2018 = container.querySelector('g[data-year="2018"]')
    const group2019 = container.querySelector('g[data-year="2019"]')
    expect(group2018).not.toBeNull()
    const dimmed2018 = group2018!.querySelectorAll('rect[opacity="0.4"]')
    expect(dimmed2018.length).toBe(10)
    // The hovered year stays at full opacity
    const dimmed2019 = group2019!.querySelectorAll('rect[opacity="0.4"]')
    expect(dimmed2019.length).toBe(0)
  })

  test("forces the rate label visible for the hovered year", () => {
    // 2019 is at index 1, which is normally hidden (every 2 years).
    const { rerender } = render(<Distribution {...baseProps} />)
    expect(screen.queryByText("0.92%")).toBeNull()
    rerender(<Distribution {...baseProps} hovered={2019} />)
    expect(screen.getByText("0.92%")).toBeInTheDocument()
  })

  test("calls setHovered when entering and leaving a year's hit zone", () => {
    const setHovered = vi.fn()
    const { container } = render(
      <Distribution {...baseProps} setHovered={setHovered} />
    )
    const group2020 = container.querySelector('g[data-year="2020"]')
    expect(group2020).not.toBeNull()
    fireEvent.mouseEnter(group2020!)
    expect(setHovered).toHaveBeenCalledWith(2020)
    fireEvent.mouseLeave(group2020!)
    expect(setHovered).toHaveBeenLastCalledWith(null)
  })

  test("rescales the bars when the gender filter changes", () => {
    // Buckets sum to 200_000 → niceMax = 200_000. With gender='m' the ratio is
    // 0.8, so each bucket scales to 80% of its raw value but the total stays
    // below 200_000 (160_000) → niceMax remains 200_000. That makes the
    // rendered bar heights directly proportional to the gender ratio.
    const yearsAsymmetric: DistributionYear[] = [
      {
        year: 2020,
        buckets: [
          1_000, 2_000, 3_000, 5_000, 9_000, 20_000, 50_000, 70_000, 30_000,
          10_000,
        ],
        rate: 0.99,
        m: 80,
        f: 20,
      },
    ]
    const totalBucketHeight = (root: ParentNode): number => {
      const rects = root.querySelectorAll(
        'rect[fill]:not([fill="transparent"])'
      )
      let sum = 0
      rects.forEach((r) => {
        sum += parseFloat(r.getAttribute("height") || "0")
      })
      return sum
    }
    const { container, rerender } = render(
      <Distribution {...baseProps} years={yearsAsymmetric} gender="all" />
    )
    const heightAll = totalBucketHeight(container)
    rerender(<Distribution {...baseProps} years={yearsAsymmetric} gender="m" />)
    const heightM = totalBucketHeight(container)
    expect(heightM / heightAll).toBeCloseTo(0.8, 1)
  })
})

import { fireEvent, render, screen, within } from "@testing-library/react"
import { describe, expect, test, vi } from "vitest"

import Comparison, {
  type ComparisonLabels,
  type ComparisonYearData,
} from "@/components/views/Comparison"

const baseLabels: ComparisonLabels = {
  monthlyDeaths: "Monthly deaths",
  comparison: "Comparison",
  selectYears: "Select years",
  selectedSubtitle: "2 year(s) selected · max 7",
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

const mkYear = (year: number): ComparisonYearData => ({
  year,
  monthly: Array.from({ length: 12 }, (_, i) => 50_000 + i * 100 + year),
})

const sample: ComparisonYearData[] = [
  mkYear(2018),
  mkYear(2019),
  mkYear(2020),
  mkYear(2021),
  mkYear(2022),
  mkYear(2023),
  mkYear(2024),
  mkYear(2025),
]

const baseProps = {
  years: sample,
  selected: [2018, 2020],
  onSelectedChange: vi.fn(),
  events: [],
  labels: baseLabels,
  locale: "en",
}

describe("Comparison view", () => {
  test("renders the two main sections (compare card, year picker)", () => {
    render(<Comparison {...baseProps} onSelectedChange={vi.fn()} />)
    expect(screen.getByTestId("comparison-compare")).toBeInTheDocument()
    expect(screen.getByTestId("comparison-picker")).toBeInTheDocument()
  })

  test("renders the i18n subtitle string verbatim", () => {
    render(<Comparison {...baseProps} onSelectedChange={vi.fn()} />)
    const compare = screen.getByTestId("comparison-compare")
    expect(compare.textContent).toMatch(/2 year\(s\) selected · max 7/)
  })

  test("renders the i18n subtitle string verbatim in FR locale", () => {
    render(
      <Comparison
        {...baseProps}
        locale="fr"
        labels={{
          ...baseLabels,
          selectedSubtitle: "2 année(s) sélectionnée(s) · max. 7",
        }}
        onSelectedChange={vi.fn()}
      />
    )
    const compare = screen.getByTestId("comparison-compare")
    expect(compare.textContent).toMatch(
      /2 année\(s\) sélectionnée\(s\) · max\. 7/
    )
  })

  test("year picker renders one pill per year in the dataset", () => {
    render(<Comparison {...baseProps} onSelectedChange={vi.fn()} />)
    const picker = screen.getByTestId("comparison-picker")
    for (const y of sample) {
      expect(
        within(picker).getByRole("button", { name: String(y.year) })
      ).toBeInTheDocument()
    }
  })

  test("clicking a non-selected year adds it to selection", () => {
    const onSelectedChange = vi.fn()
    render(<Comparison {...baseProps} onSelectedChange={onSelectedChange} />)
    const picker = screen.getByTestId("comparison-picker")
    fireEvent.click(within(picker).getByRole("button", { name: "2021" }))
    expect(onSelectedChange).toHaveBeenCalledWith([2018, 2020, 2021])
  })

  test("clicking a selected year removes it from selection", () => {
    const onSelectedChange = vi.fn()
    render(<Comparison {...baseProps} onSelectedChange={onSelectedChange} />)
    const picker = screen.getByTestId("comparison-picker")
    fireEvent.click(within(picker).getByRole("button", { name: "2018" }))
    expect(onSelectedChange).toHaveBeenCalledWith([2020])
  })

  test("active pill has aria-pressed=true for selected years", () => {
    render(<Comparison {...baseProps} onSelectedChange={vi.fn()} />)
    const picker = screen.getByTestId("comparison-picker")
    expect(
      within(picker).getByRole("button", { name: "2018" })
    ).toHaveAttribute("aria-pressed", "true")
    expect(
      within(picker).getByRole("button", { name: "2019" })
    ).toHaveAttribute("aria-pressed", "false")
  })

  test("clicking a non-selected year is a no-op when selection is at the max cap", () => {
    const onSelectedChange = vi.fn()
    const fullSelection = [2018, 2019, 2020, 2021, 2022, 2023, 2024]
    render(
      <Comparison
        {...baseProps}
        selected={fullSelection}
        onSelectedChange={onSelectedChange}
      />
    )
    const picker = screen.getByTestId("comparison-picker")
    fireEvent.click(within(picker).getByRole("button", { name: "2025" }))
    expect(onSelectedChange).not.toHaveBeenCalled()
  })

  test("clicking a selected year still removes it when selection is at the max cap", () => {
    const onSelectedChange = vi.fn()
    const fullSelection = [2018, 2019, 2020, 2021, 2022, 2023, 2024]
    render(
      <Comparison
        {...baseProps}
        selected={fullSelection}
        onSelectedChange={onSelectedChange}
      />
    )
    const picker = screen.getByTestId("comparison-picker")
    fireEvent.click(within(picker).getByRole("button", { name: "2024" }))
    expect(onSelectedChange).toHaveBeenCalledWith([
      2018, 2019, 2020, 2021, 2022, 2023,
    ])
  })

  test("respects a custom maxSelected prop", () => {
    const onSelectedChange = vi.fn()
    render(
      <Comparison
        {...baseProps}
        selected={[2018, 2019, 2020]}
        maxSelected={3}
        onSelectedChange={onSelectedChange}
      />
    )
    const picker = screen.getByTestId("comparison-picker")
    fireEvent.click(within(picker).getByRole("button", { name: "2021" }))
    expect(onSelectedChange).not.toHaveBeenCalled()
  })

  test("years are rendered in chronological order regardless of input order", () => {
    const shuffled: ComparisonYearData[] = [
      mkYear(2022),
      mkYear(2018),
      mkYear(2020),
      mkYear(2019),
    ]
    render(
      <Comparison
        {...baseProps}
        years={shuffled}
        selected={[2018]}
        onSelectedChange={vi.fn()}
      />
    )
    const picker = screen.getByTestId("comparison-picker")
    const buttons = within(picker).getAllByRole("button")
    expect(buttons.map((b) => b.textContent)).toEqual([
      "2018",
      "2019",
      "2020",
      "2022",
    ])
  })
})

describe("Comparison view — i18n keys", () => {
  test("Select years and selectedSubtitle keys exist in en.json and fr.json", async () => {
    const [enLang, frLang] = await Promise.all([
      import("@/lang/en.json"),
      import("@/lang/fr.json"),
    ])
    const en = enLang.default as Record<string, string>
    const fr = frLang.default as Record<string, string>
    expect(en["Select years"]).toBeDefined()
    expect(fr["Select years"]).toBeDefined()
    expect(en["comparison.selectedSubtitle"]).toBeDefined()
    expect(fr["comparison.selectedSubtitle"]).toBeDefined()
    // ICU placeholders for react-intl plural / variable interpolation
    expect(en["comparison.selectedSubtitle"]).toMatch(/\{n\}/)
    expect(en["comparison.selectedSubtitle"]).toMatch(/\{max\}/)
    expect(fr["comparison.selectedSubtitle"]).toMatch(/\{n\}/)
    expect(fr["comparison.selectedSubtitle"]).toMatch(/\{max\}/)
  })
})

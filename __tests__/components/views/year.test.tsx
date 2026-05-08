import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, test, vi } from "vitest"

import Year, { type YearData, type YearLabels } from "@/components/views/Year"
import type { YearEvent } from "@/data/events"

const labels: YearLabels = {
  // Headline strip
  mortalityRate: "Mortality rate",
  deathsCount: "Deaths",
  population: "Population",
  yearOverYear: "YoY",
  partial: "PARTIAL",
  sinceAvg: "vs avg",
  // Trend card
  trend: "Trend",
  trendSubtitle: "annual",
  rateMin: "min",
  rateMax: "max",
  avgLabel: "AVG",
  // Monthly card
  monthlyDeaths: "Monthly",
  monthlySubtitle: "compared",
  peak: "Peak",
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
  // Events card
  notableEvents: "Notable events",
  // Scrubber
  yearLabel: "Year",
}

const mkYear = (year: number, rate: number): YearData => ({
  year,
  rate,
  deaths: Math.round(rate * 600_000),
  pop: 65_000_000,
  monthly: Array.from({ length: 12 }, (_, i) => 50_000 + i * 100),
})

const sample: YearData[] = [
  mkYear(2018, 0.913),
  mkYear(2019, 0.917),
  mkYear(2020, 0.992),
  mkYear(2021, 0.971),
  mkYear(2022, 1.005),
]

const events: YearEvent[] = [
  { year: 2020, month: 4, label: "COVID first wave", desc: "Pandemic begins" },
  { year: 2020, month: 11, label: "COVID second wave", desc: "Autumn" },
  { year: 2022, month: 7, label: "Heatwave", desc: "Hot summer" },
]

const baseProps = {
  years: sample,
  activeYear: 2020,
  onActiveYearChange: vi.fn(),
  events,
  labels,
  locale: "en",
}

describe("Year view", () => {
  test("renders the four main sections (scrubber, headline, trend, monthly)", () => {
    render(<Year {...baseProps} onActiveYearChange={vi.fn()} />)
    expect(screen.getByTestId("year-scrubber")).toBeInTheDocument()
    expect(screen.getByTestId("year-headline")).toBeInTheDocument()
    expect(screen.getByTestId("year-trend")).toBeInTheDocument()
    expect(screen.getByTestId("year-monthly")).toBeInTheDocument()
  })

  test("renders the events card when the active year has events", () => {
    render(<Year {...baseProps} onActiveYearChange={vi.fn()} />)
    const eventsCard = screen.getByTestId("year-events")
    expect(eventsCard).toBeInTheDocument()
    expect(eventsCard).toHaveTextContent("COVID first wave")
    expect(eventsCard).toHaveTextContent("COVID second wave")
    // 2022 events must NOT show when active year is 2020
    expect(eventsCard).not.toHaveTextContent("Heatwave")
  })

  test("hides the events card when the active year has no events", () => {
    render(
      <Year {...baseProps} activeYear={2018} onActiveYearChange={vi.fn()} />
    )
    expect(screen.queryByTestId("year-events")).toBeNull()
  })

  test("hides the events card when the events prop is empty", () => {
    render(<Year {...baseProps} events={[]} onActiveYearChange={vi.fn()} />)
    expect(screen.queryByTestId("year-events")).toBeNull()
  })

  test("scrubber range covers the years span", () => {
    render(<Year {...baseProps} onActiveYearChange={vi.fn()} />)
    const scrubber = screen.getByTestId(
      "year-scrubber-input"
    ) as HTMLInputElement
    expect(scrubber.min).toBe("2018")
    expect(scrubber.max).toBe("2022")
    expect(scrubber.value).toBe("2020")
  })

  test("scrubber change calls onActiveYearChange with the new year", () => {
    const onActiveYearChange = vi.fn()
    render(<Year {...baseProps} onActiveYearChange={onActiveYearChange} />)
    const scrubber = screen.getByTestId("year-scrubber-input")
    fireEvent.change(scrubber, { target: { value: "2021" } })
    expect(onActiveYearChange).toHaveBeenCalledWith(2021)
  })

  test("renders the partial badge in the scrubber when activeYear === partialYear", () => {
    render(
      <Year
        {...baseProps}
        activeYear={2022}
        partialYear={2022}
        onActiveYearChange={vi.fn()}
      />
    )
    const scrubber = screen.getByTestId("year-scrubber")
    expect(scrubber).toHaveAttribute("data-partial", "true")
    expect(scrubber.textContent).toMatch(/PARTIAL/)
  })

  test("does not render the partial badge for a non-partial year", () => {
    render(
      <Year
        {...baseProps}
        activeYear={2020}
        partialYear={2026}
        onActiveYearChange={vi.fn()}
      />
    )
    const scrubber = screen.getByTestId("year-scrubber")
    expect(scrubber).not.toHaveAttribute("data-partial", "true")
    expect(scrubber.textContent).not.toMatch(/PARTIAL/)
  })

  test("headline shows the formatted rate for the active year", () => {
    render(<Year {...baseProps} onActiveYearChange={vi.fn()} />)
    const headline = screen.getByTestId("year-headline")
    // 2020 rate = 0.992 → 0.992
    expect(headline.textContent).toMatch(/0\.992/)
  })

  test("headline shows formatted deaths and population for the active year", () => {
    render(<Year {...baseProps} locale="en" onActiveYearChange={vi.fn()} />)
    const headline = screen.getByTestId("year-headline")
    // 2020 deaths = round(0.992 * 600_000) = 595_200
    expect(headline.textContent).toMatch(/595,200/)
    // pop = 65_000_000 → 65M-ish in compact en
    expect(headline.textContent).toMatch(/65/)
  })

  test("headline shows year-over-year delta versus previous year", () => {
    render(<Year {...baseProps} onActiveYearChange={vi.fn()} />)
    const headline = screen.getByTestId("year-headline")
    // YoY delta for 2020 vs 2019 = (0.992 - 0.917) / 0.917 * 100 ≈ +8.18%
    expect(headline.textContent).toMatch(/8\.1[78]/)
  })

  test("locale changes number formatting in the headline", () => {
    const { rerender } = render(
      <Year {...baseProps} locale="en" onActiveYearChange={vi.fn()} />
    )
    const enHeadline = screen.getByTestId("year-headline")
    expect(enHeadline.textContent).toMatch(/595,200/)

    rerender(<Year {...baseProps} locale="fr" onActiveYearChange={vi.fn()} />)
    const frHeadline = screen.getByTestId("year-headline")
    // FR uses non-breaking space — comma form should not appear
    expect(frHeadline.textContent).not.toMatch(/595,200/)
    expect(frHeadline.textContent).toMatch(/595/)
    expect(frHeadline.textContent).toMatch(/200/)
  })

  test("events card lists each matching event with its label and description", () => {
    render(<Year {...baseProps} onActiveYearChange={vi.fn()} />)
    const eventsCard = screen.getByTestId("year-events")
    expect(eventsCard.textContent).toMatch(/COVID first wave/)
    expect(eventsCard.textContent).toMatch(/Pandemic begins/)
    expect(eventsCard.textContent).toMatch(/COVID second wave/)
    expect(eventsCard.textContent).toMatch(/Autumn/)
  })
})

describe("Year view — i18n keys", () => {
  test("all event keys referenced in EVENTS_RAW exist in en.json and fr.json", async () => {
    const [enLang, frLang, eventsModule] = await Promise.all([
      import("@/lang/en.json"),
      import("@/lang/fr.json"),
      import("@/data/events"),
    ])
    const en = enLang.default as Record<string, string>
    const fr = frLang.default as Record<string, string>
    for (const ev of eventsModule.EVENTS_RAW) {
      expect(en[ev.labelKey], `EN missing ${ev.labelKey}`).toBeDefined()
      expect(en[ev.descKey], `EN missing ${ev.descKey}`).toBeDefined()
      expect(fr[ev.labelKey], `FR missing ${ev.labelKey}`).toBeDefined()
      expect(fr[ev.descKey], `FR missing ${ev.descKey}`).toBeDefined()
    }
  })
})

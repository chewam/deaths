import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"

import Distribution, {
  type DistributionViewLabels,
} from "@/components/views/Distribution"
import type {
  DistributionGender,
  DistributionYear,
} from "@/components/charts/distribution-geometry"

const baseLabels: DistributionViewLabels = {
  deathsByAge: "Deaths by age",
  subtitle: "Deaths by age group with overall mortality rate",
  deathsCount: "Deaths",
  mortalityRate: "Mortality rate",
  ageBuckets: [
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
  ],
}

const sampleYears: DistributionYear[] = [
  {
    year: 2018,
    buckets: [
      1_950, 1_220, 2_780, 5_010, 11_690, 30_910, 69_540, 154_830, 217_220,
      114_498,
    ],
    rate: 0.91,
    m: 292_410,
    f: 317_238,
  },
  {
    year: 2019,
    buckets: [
      1_900, 1_180, 2_700, 4_870, 11_350, 30_010, 67_410, 150_300, 215_430,
      128_093,
    ],
    rate: 0.91,
    m: 294_010,
    f: 319_233,
  },
  {
    year: 2020,
    buckets: [
      2_010, 1_310, 2_960, 5_310, 12_360, 32_650, 73_130, 162_990, 232_870,
      143_332,
    ],
    rate: 0.99,
    m: 322_510,
    f: 346_412,
  },
]

const baseProps = {
  years: sampleYears,
  gender: "all" as DistributionGender,
  hovered: null as number | null,
  setHovered: () => {},
  labels: baseLabels,
  locale: "en",
}

describe("Distribution view", () => {
  test("renders the single distribution card", () => {
    render(<Distribution {...baseProps} />)
    expect(screen.getByTestId("view-distribution")).toBeInTheDocument()
    expect(screen.getByTestId("distribution-card")).toBeInTheDocument()
  })

  test("renders the header label and subtitle from props", () => {
    render(<Distribution {...baseProps} />)
    const card = screen.getByTestId("distribution-card")
    expect(card).toHaveTextContent("Deaths by age")
    expect(card).toHaveTextContent(
      "Deaths by age group with overall mortality rate"
    )
  })

  test("renders the FR labels verbatim when passed via props", () => {
    render(
      <Distribution
        {...baseProps}
        locale="fr"
        labels={{
          ...baseLabels,
          deathsByAge: "Décès par âge",
          subtitle: "Décès par tranche d'âge et taux de mortalité",
        }}
      />
    )
    const card = screen.getByTestId("distribution-card")
    expect(card).toHaveTextContent("Décès par âge")
    expect(card).toHaveTextContent(
      "Décès par tranche d'âge et taux de mortalité"
    )
  })

  test("renders the chart with age bucket legend entries", () => {
    render(<Distribution {...baseProps} />)
    for (const bucket of baseLabels.ageBuckets) {
      expect(screen.getByText(bucket)).toBeInTheDocument()
    }
  })

  test("renders empty card without crashing when years array is empty", () => {
    render(<Distribution {...baseProps} years={[]} />)
    expect(screen.getByTestId("view-distribution")).toBeInTheDocument()
    expect(screen.getByTestId("distribution-card")).toBeInTheDocument()
  })

  test("respects compact prop on the section gap", () => {
    const { rerender } = render(<Distribution {...baseProps} compact={false} />)
    const wide = screen.getByTestId("view-distribution")
    expect(wide).toHaveStyle({ gap: "28px" })
    rerender(<Distribution {...baseProps} compact={true} />)
    const compact = screen.getByTestId("view-distribution")
    expect(compact).toHaveStyle({ gap: "16px" })
  })
})

describe("Distribution view — i18n keys", () => {
  test("Deaths by age and distribution.subtitle keys exist in en.json and fr.json", async () => {
    const [enLang, frLang] = await Promise.all([
      import("@/lang/en.json"),
      import("@/lang/fr.json"),
    ])
    const en = enLang.default as Record<string, string>
    const fr = frLang.default as Record<string, string>
    expect(en["Deaths by age"]).toBeDefined()
    expect(fr["Deaths by age"]).toBeDefined()
    expect(en["distribution.subtitle"]).toBeDefined()
    expect(fr["distribution.subtitle"]).toBeDefined()
  })
})

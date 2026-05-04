import { useState } from "react"
import { Card, Label, Mini, NavBtn, Pill, Stat } from "@/components/atoms"
import Distribution, {
  type DistributionLabels,
} from "@/components/charts/Distribution"
import type {
  DistributionGender,
  DistributionYear,
} from "@/components/charts/distribution-geometry"
import Monthly, {
  type MonthlyLabels,
  type MonthlyMode,
} from "@/components/charts/Monthly"
import type {
  MonthlyEvent,
  MonthlyHover,
  MonthlyYear,
} from "@/components/charts/monthly-geometry"
import Trend, { type TrendChartType } from "@/components/charts/Trend"
import type { TrendYear } from "@/components/charts/trend-geometry"

const Section = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => (
  <section className="flex flex-col gap-4">
    <Label>{title}</Label>
    <div className="flex flex-wrap items-start gap-6">{children}</div>
  </section>
)

const TREND_SAMPLE: TrendYear[] = [
  { year: 2000, rate: 0.92, deaths: 540_601, pop: 60_508_150 },
  { year: 2001, rate: 0.9, deaths: 541_028, pop: 61_181_560 },
  { year: 2002, rate: 0.91, deaths: 545_204, pop: 61_804_087 },
  { year: 2003, rate: 0.95, deaths: 562_528, pop: 62_417_680 },
  { year: 2004, rate: 0.86, deaths: 519_470, pop: 62_998_773 },
  { year: 2005, rate: 0.88, deaths: 538_080, pop: 63_513_032 },
  { year: 2006, rate: 0.84, deaths: 521_016, pop: 64_013_300 },
  { year: 2007, rate: 0.84, deaths: 531_162, pop: 64_374_990 },
  { year: 2008, rate: 0.85, deaths: 542_562, pop: 64_703_519 },
  { year: 2009, rate: 0.85, deaths: 548_541, pop: 65_005_785 },
  { year: 2010, rate: 0.86, deaths: 551_218, pop: 65_276_983 },
  { year: 2011, rate: 0.84, deaths: 545_057, pop: 65_523_980 },
  { year: 2012, rate: 0.87, deaths: 569_868, pop: 65_802_785 },
  { year: 2013, rate: 0.87, deaths: 569_236, pop: 66_073_000 },
  { year: 2014, rate: 0.85, deaths: 559_293, pop: 66_311_000 },
  { year: 2015, rate: 0.9, deaths: 593_680, pop: 66_548_272 },
  { year: 2016, rate: 0.89, deaths: 593_865, pop: 66_724_103 },
  { year: 2017, rate: 0.91, deaths: 606_274, pop: 66_864_408 },
  { year: 2018, rate: 0.91, deaths: 609_648, pop: 66_977_107 },
  { year: 2019, rate: 0.91, deaths: 613_243, pop: 67_063_703 },
  { year: 2020, rate: 0.99, deaths: 668_922, pop: 67_287_241 },
  { year: 2021, rate: 0.97, deaths: 660_168, pop: 67_499_343 },
]

const TREND_LABELS = {
  mortalityRate: "Mortality rate",
  deathsCount: "Deaths",
  population: "Population",
  avgLabel: "AVG",
}

const MONTHLY_SAMPLE: MonthlyYear[] = [
  {
    year: 2018,
    monthly: [
      57_842, 64_119, 56_996, 50_874, 47_249, 45_523, 47_178, 47_044, 45_890,
      50_140, 51_344, 53_401,
    ],
  },
  {
    year: 2019,
    monthly: [
      59_173, 51_607, 51_810, 49_419, 49_259, 48_268, 50_511, 47_366, 47_152,
      52_257, 51_507, 53_676,
    ],
  },
  {
    year: 2020,
    monthly: [
      55_503, 50_192, 65_405, 78_625, 50_899, 47_519, 47_837, 47_995, 47_887,
      54_403, 64_135, 65_560,
    ],
  },
  {
    year: 2021,
    monthly: [
      66_830, 53_690, 56_274, 56_400, 50_640, 49_054, 50_138, 49_853, 47_708,
      50_794, 53_220, 55_625,
    ],
  },
]

const MONTHLY_LABELS: MonthlyLabels = {
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

const MONTHLY_EVENTS: MonthlyEvent[] = [
  { year: 2020, month: 2, label: "COVID-19" },
  { year: 2020, month: 10, label: "2nd wave" },
]

const DISTRIBUTION_SAMPLE: DistributionYear[] = [
  {
    year: 2017,
    buckets: [
      1_990, 1_240, 2_810, 5_090, 11_830, 31_230, 70_220, 156_340, 218_650,
      106_874,
    ],
    rate: 0.91,
    m: 290_840,
    f: 315_434,
  },
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
  {
    year: 2021,
    buckets: [
      1_980, 1_290, 2_910, 5_220, 12_140, 32_080, 71_890, 160_220, 229_530,
      142_908,
    ],
    rate: 0.97,
    m: 318_420,
    f: 341_748,
  },
]

const DISTRIBUTION_LABELS: DistributionLabels = {
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

const Playground = () => {
  const [locale, setLocale] = useState<"en" | "fr">("en")
  const [view, setView] = useState<"overview" | "year" | "comparison">(
    "overview"
  )
  const [chartType, setChartType] = useState<TrendChartType>("area")
  const [hoveredYear, setHoveredYear] = useState<number | null>(null)
  const [monthlyMode, setMonthlyMode] = useState<MonthlyMode>("single")
  const [monthlySelected, setMonthlySelected] = useState<number[]>([2018, 2020])
  const [monthlyHover, setMonthlyHover] = useState<MonthlyHover | null>(null)
  const [distributionGender, setDistributionGender] =
    useState<DistributionGender>("all")
  const [distributionHover, setDistributionHover] = useState<number | null>(
    null
  )

  const toggleSelected = (year: number) => {
    setMonthlySelected((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    )
  }

  return (
    <main className="flex flex-col gap-12 p-12">
      <h1 className="font-display tracking-display text-text text-3xl">
        Atoms playground
      </h1>

      <Section title="Pill — locale toggle">
        <Pill active={locale === "en"} onClick={() => setLocale("en")}>
          EN
        </Pill>
        <Pill active={locale === "fr"} onClick={() => setLocale("fr")}>
          FR
        </Pill>
      </Section>

      <Section title="NavBtn — view switcher">
        <NavBtn
          active={view === "overview"}
          onClick={() => setView("overview")}
        >
          Overview
        </NavBtn>
        <NavBtn active={view === "year"} onClick={() => setView("year")}>
          Year
        </NavBtn>
        <NavBtn
          active={view === "comparison"}
          onClick={() => setView("comparison")}
        >
          Comparison
        </NavBtn>
      </Section>

      <Section title="Label">
        <Label>Source</Label>
        <Label>Year</Label>
        <Label>Gender</Label>
      </Section>

      <Section title="Card">
        <Card className="w-72">
          <p className="text-text-dim">Card content lives here.</p>
        </Card>
      </Section>

      <Section title="Stat — variants">
        <Stat label="death rate" value="1.234" unit="%" />
        <Stat
          label="death rate"
          value="1.234"
          unit="%"
          big
          sub="vs avg 1.087%"
        />
        <Stat
          label="vs prev"
          value="673,201"
          delta={2.5}
          deltaLabel="vs prev"
        />
        <Stat label="vs avg" value="612,830" delta={-1.7} deltaLabel="vs avg" />
        <Stat label="rate" value="1.5" unit="%" colorize={1} />
      </Section>

      <Section title="Mini">
        <Mini label="rate min" value="0.812%" />
        <Mini label="rate max" value="1.342%" />
        <Mini label="years" value={26} />
      </Section>

      <Section title="TrendChart — line / area">
        <div className="flex gap-2">
          <Pill
            active={chartType === "line"}
            onClick={() => setChartType("line")}
          >
            line
          </Pill>
          <Pill
            active={chartType === "area"}
            onClick={() => setChartType("area")}
          >
            area
          </Pill>
        </div>
        <Card className="w-full">
          <Trend
            years={TREND_SAMPLE}
            chartType={chartType}
            hoveredYear={hoveredYear}
            setHoveredYear={setHoveredYear}
            labels={TREND_LABELS}
          />
        </Card>
      </Section>

      <Section title="MonthlyChart — single / compare">
        <div className="flex gap-2">
          <Pill
            active={monthlyMode === "single"}
            onClick={() => setMonthlyMode("single")}
          >
            single
          </Pill>
          <Pill
            active={monthlyMode === "compare"}
            onClick={() => setMonthlyMode("compare")}
          >
            compare
          </Pill>
        </div>
        {monthlyMode === "compare" && (
          <div className="flex flex-wrap gap-2">
            {MONTHLY_SAMPLE.map((y) => (
              <Pill
                key={y.year}
                active={monthlySelected.includes(y.year)}
                onClick={() => toggleSelected(y.year)}
              >
                {y.year}
              </Pill>
            ))}
          </div>
        )}
        <Card className="w-full">
          <Monthly
            years={MONTHLY_SAMPLE}
            mode={monthlyMode}
            selected={monthlySelected}
            events={MONTHLY_EVENTS}
            hovered={monthlyHover}
            setHovered={setMonthlyHover}
            labels={MONTHLY_LABELS}
          />
        </Card>
      </Section>

      <Section title="DistributionChart — gender filter + hover">
        <div className="flex gap-2">
          <Pill
            active={distributionGender === "all"}
            onClick={() => setDistributionGender("all")}
          >
            all
          </Pill>
          <Pill
            active={distributionGender === "m"}
            onClick={() => setDistributionGender("m")}
          >
            male
          </Pill>
          <Pill
            active={distributionGender === "f"}
            onClick={() => setDistributionGender("f")}
          >
            female
          </Pill>
        </div>
        <Card className="w-full">
          <Distribution
            years={DISTRIBUTION_SAMPLE}
            gender={distributionGender}
            hovered={distributionHover}
            setHovered={setDistributionHover}
            labels={DISTRIBUTION_LABELS}
          />
        </Card>
      </Section>
    </main>
  )
}

export default Playground

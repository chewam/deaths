import { useState } from "react"
import { Card, Label, Mini, NavBtn, Pill, Stat } from "@/components/atoms"
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

const Playground = () => {
  const [locale, setLocale] = useState<"en" | "fr">("en")
  const [view, setView] = useState<"overview" | "year" | "comparison">(
    "overview"
  )
  const [chartType, setChartType] = useState<TrendChartType>("area")
  const [hoveredYear, setHoveredYear] = useState<number | null>(null)

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
    </main>
  )
}

export default Playground

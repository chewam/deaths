import { useState } from "react"
import { Card, Label, Mini, NavBtn, Pill, Stat } from "@/components/atoms"

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

const Playground = () => {
  const [locale, setLocale] = useState<"en" | "fr">("en")
  const [view, setView] = useState<"overview" | "year" | "comparison">(
    "overview"
  )

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
    </main>
  )
}

export default Playground

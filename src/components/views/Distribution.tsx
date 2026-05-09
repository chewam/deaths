import { Card, Label } from "@/components/atoms"
import DistributionChart from "@/components/charts/Distribution"
import type {
  DistributionGender,
  DistributionYear,
} from "@/components/charts/distribution-geometry"

export type DistributionViewLabels = {
  deathsByAge: string
  subtitle: string
  deathsCount: string
  mortalityRate: string
  ageBuckets: string[]
}

export type DistributionProps = {
  years: DistributionYear[]
  gender: DistributionGender
  hovered: number | null
  setHovered: (year: number | null) => void
  labels: DistributionViewLabels
  locale: string
  compact?: boolean
  fillHeight?: boolean
}

// Bar value labels look cleaner as integer K (e.g. 170K, not 169.6K).
// Millions still get one decimal (e.g. 68.6M) for readable totals.
const fmtCompact = (n: number, locale: string): string =>
  new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: Math.abs(n) >= 1e6 ? 1 : 0,
  }).format(n)

const Distribution = ({
  years,
  gender,
  hovered,
  setHovered,
  labels,
  locale,
  compact = false,
  fillHeight = false,
}: DistributionProps) => {
  const sectionGap = compact ? 16 : 28

  return (
    <div
      data-testid="view-distribution"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: sectionGap,
        ...(fillHeight ? { flex: 1, minHeight: 0 } : null),
      }}
    >
      <Card
        data-testid="distribution-card"
        className={fillHeight ? "flex min-h-0 flex-1 flex-col" : undefined}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 18,
          }}
        >
          <div>
            <Label>{labels.deathsByAge}</Label>
            <div
              className="text-text-dim"
              style={{ fontSize: 12, marginTop: 4 }}
            >
              {labels.subtitle}
            </div>
          </div>
        </div>
        <DistributionChart
          years={years}
          gender={gender}
          hovered={hovered}
          setHovered={setHovered}
          labels={{
            deathsCount: labels.deathsCount,
            mortalityRate: labels.mortalityRate,
            ageBuckets: labels.ageBuckets,
          }}
          formatCompact={(n) => fmtCompact(n, locale)}
          fillHeight={fillHeight}
        />
      </Card>
    </div>
  )
}

export default Distribution

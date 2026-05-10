import { useEffect, useMemo, useRef, useState } from "react"
import { geoNaturalEarth1, geoPath } from "d3-geo"
import { feature } from "topojson-client"
import type { Feature, Geometry } from "geojson"

import { Label, Stat } from "@/components/atoms"

export type OriginsViewLabels = {
  bornInFrance: string
  bornAbroad: string
  distinctCountries: string
  topOrigin: string
  deathsByOrigin: string
  franceExcluded: string
  topCountries: string
  ofForeignTotal: string
  loading: string
  loadError: string
  franceExcludedShort: string
}

export type OriginsViewProps = {
  data: OriginsRawData
  labels: OriginsViewLabels
  locale: string
}

const fmtNum = (n: number, locale: string) =>
  new Intl.NumberFormat(locale).format(n)

// World-atlas TopoJSON geometries: countries-110m, ~50 KB. We hold the typed
// FeatureCollection at module scope after the first conversion.
type CountryFeature = Feature<Geometry, { name: string }> & {
  id?: string | number
}

const WORLD_TOPOJSON_URL = "/data/world-110m.json"

const Origins = ({ data, labels, locale }: OriginsViewProps) => {
  const [worldGeo, setWorldGeo] = useState<CountryFeature[] | null>(null)
  const [loadErr, setLoadErr] = useState<string | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)

  // Load world topojson once, convert to GeoJSON features.
  useEffect(() => {
    let cancel = false
    fetch(WORLD_TOPOJSON_URL)
      .then((r) => r.json())
      .then((topo) => {
        if (cancel) return
        const features = (
          feature(topo, topo.objects.countries) as unknown as {
            features: CountryFeature[]
          }
        ).features
        setWorldGeo(features)
      })
      .catch(() => {
        if (!cancel) setLoadErr(labels.loadError)
      })
    return () => {
      cancel = true
    }
  }, [labels.loadError])

  // Build a fast lookup: m49 → country
  const byM49 = useMemo(() => {
    const m: Record<number, OriginsCountry> = {}
    for (const c of data.countries) m[c.m49] = c
    return m
  }, [data.countries])

  const max = data.countries[0]?.count ?? 1
  const logMax = Math.log(max + 1)

  const colorFor = (count: number | null | undefined) => {
    if (!count) return "var(--color-bg)"
    const t = Math.log(count + 1) / logMax
    const tt = 0.08 + t * 0.92 // floor at 8% so count=1 is visible
    return `color-mix(in srgb, var(--color-text) ${(tt * 100).toFixed(1)}%, var(--color-bg))`
  }

  // Compute SVG paths once we have the geo.
  const mapPaths = useMemo(() => {
    if (!worldGeo) return null
    const W = 1100
    const H = 540
    const projection = geoNaturalEarth1().fitSize([W, H], {
      type: "Sphere",
    } as unknown as Geometry)
    const pathGen = geoPath(projection)
    return {
      W,
      H,
      features: worldGeo.map((f) => ({
        m49: typeof f.id === "string" ? parseInt(f.id, 10) : (f.id as number),
        name: f.properties?.name ?? "",
        d: pathGen(f) ?? "",
      })),
    }
  }, [worldGeo])

  const totalForeign = data.meta.bornAbroad
  const top10 = data.countries.slice(0, 10)
  const top10Max = top10[0]?.count ?? 1
  const topName =
    locale === "fr" ? data.countries[0]?.name_fr : data.countries[0]?.name_en

  const pctFrance = (
    (data.meta.bornInFrance / (data.meta.bornInFrance + data.meta.bornAbroad)) *
    100
  ).toFixed(1)
  const pctForeign = (
    (data.meta.bornAbroad / (data.meta.bornInFrance + data.meta.bornAbroad)) *
    100
  ).toFixed(1)

  return (
    <div data-testid="view-origins" className="flex flex-col gap-7 pb-9">
      {/* KPI strip */}
      <div className="bg-border border-border grid grid-cols-1 gap-px border md:grid-cols-4">
        <Stat
          label={labels.bornInFrance}
          value={fmtNum(data.meta.bornInFrance, locale)}
          sub={`${pctFrance}%`}
        />
        <Stat
          label={labels.bornAbroad}
          value={fmtNum(data.meta.bornAbroad, locale)}
          sub={`${pctForeign}%`}
        />
        <Stat
          label={labels.distinctCountries}
          value={data.meta.distinctCountries}
          sub="INSEE"
        />
        <Stat
          label={labels.topOrigin}
          value={topName ?? "—"}
          sub={
            data.countries[0]
              ? `${fmtNum(data.countries[0].count, locale)} · ${(
                  (data.countries[0].count / totalForeign) *
                  100
                ).toFixed(1)}%`
              : "—"
          }
        />
      </div>

      {/* Map + sidebar */}
      <div className="bg-border border-border grid grid-cols-1 gap-px border lg:grid-cols-[1fr_320px]">
        {/* Map card */}
        <div className="bg-surface p-7" data-testid="origins-map">
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <div>
              <Label>{labels.deathsByOrigin}</Label>
              <div className="text-text-dim mt-1 text-[12px]">
                {labels.franceExcluded}
              </div>
            </div>
            <div className="flex items-center gap-2.5 text-[10.5px]">
              <span className="font-mono text-text-dim">1</span>
              <div className="flex">
                {[1, 10, 100, 1000, max].map((v, i) => (
                  <div
                    key={i}
                    className="h-2.5 w-5"
                    style={{ background: colorFor(v) }}
                    title={String(v)}
                  />
                ))}
              </div>
              <span className="font-mono text-text-dim">
                {fmtNum(max, locale)}
              </span>
              <span className="text-text-faint font-mono uppercase tracking-wider">
                log
              </span>
              <span className="border-border ml-2 inline-flex items-center gap-1.5 border-l pl-2.5">
                <svg width="14" height="10">
                  <defs>
                    <pattern
                      id="legend-hatch"
                      width="4"
                      height="4"
                      patternUnits="userSpaceOnUse"
                      patternTransform="rotate(45)"
                    >
                      <rect width="4" height="4" className="fill-surface" />
                      <line
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="4"
                        className="stroke-text"
                        strokeWidth="1.4"
                      />
                    </pattern>
                  </defs>
                  <rect
                    width="14"
                    height="10"
                    fill="url(#legend-hatch)"
                    className="stroke-text"
                    strokeWidth="0.8"
                  />
                </svg>
                <span className="text-text-dim">
                  {labels.franceExcludedShort}
                </span>
              </span>
            </div>
          </div>

          <div className="relative w-full">
            {!mapPaths && !loadErr && (
              <div className="text-text-faint py-20 text-center font-mono text-[11px] uppercase tracking-wider">
                {labels.loading}
              </div>
            )}
            {loadErr && (
              <div className="text-danger py-20 text-center font-mono text-[11px]">
                {loadErr}
              </div>
            )}
            {mapPaths && (
              <svg
                ref={svgRef}
                viewBox={`0 0 ${mapPaths.W} ${mapPaths.H}`}
                className="block h-auto w-full"
              >
                <defs>
                  <pattern
                    id="hatch-france"
                    width="5"
                    height="5"
                    patternUnits="userSpaceOnUse"
                    patternTransform="rotate(45)"
                  >
                    <rect width="5" height="5" className="fill-surface" />
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="5"
                      className="stroke-text"
                      strokeWidth="1.6"
                    />
                  </pattern>
                </defs>
                <rect
                  width={mapPaths.W}
                  height={mapPaths.H}
                  className="fill-bg"
                />
                {mapPaths.features.map((f, i) => {
                  const safeId = Number.isFinite(f.m49) ? f.m49 : null
                  const entry = safeId != null ? byM49[safeId] : undefined
                  const isFrance = safeId === 250
                  const isHovered = hovered === safeId && safeId != null
                  const fill = isFrance
                    ? "url(#hatch-france)"
                    : entry
                      ? colorFor(entry.count)
                      : "var(--color-bg)"
                  return (
                    <path
                      key={safeId != null ? `c${safeId}` : `x${i}`}
                      d={f.d}
                      fill={fill}
                      className={
                        isFrance
                          ? "stroke-text"
                          : isHovered
                            ? "stroke-text"
                            : "stroke-border"
                      }
                      strokeWidth={isHovered || isFrance ? 1.4 : 0.5}
                      style={{
                        cursor: entry && !isFrance ? "pointer" : "default",
                        transition: "stroke-width 120ms",
                      }}
                      onMouseEnter={() => setHovered(safeId)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      <title>
                        {isFrance
                          ? `${f.name} — ${labels.franceExcludedShort}`
                          : entry
                            ? `${locale === "fr" ? entry.name_fr : entry.name_en}: ${fmtNum(entry.count, locale)} (${((entry.count / totalForeign) * 100).toFixed(2)}% ${labels.ofForeignTotal})`
                            : f.name}
                      </title>
                    </path>
                  )
                })}
              </svg>
            )}
          </div>
        </div>

        {/* Top 10 sidebar */}
        <div className="bg-surface p-7" data-testid="origins-top10">
          <Label>{labels.topCountries}</Label>
          <div className="text-text-dim mt-1 mb-5 text-[11px] font-mono">
            {fmtNum(
              top10.reduce((s, c) => s + c.count, 0),
              locale
            )}{" "}
            / {fmtNum(totalForeign, locale)}
          </div>
          <ol className="flex flex-col gap-3">
            {top10.map((c, i) => {
              const pct = (c.count / totalForeign) * 100
              const w = (c.count / top10Max) * 100
              const isHovered = hovered === c.m49
              return (
                <li
                  key={c.iso3}
                  onMouseEnter={() => setHovered(c.m49)}
                  onMouseLeave={() => setHovered(null)}
                  className="flex cursor-pointer flex-col gap-1"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="flex min-w-0 items-baseline gap-2">
                      <span className="text-text-faint w-3.5 font-mono text-[10px]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={
                          "truncate text-[12.5px] " +
                          (isHovered ? "font-semibold" : "font-medium")
                        }
                      >
                        {locale === "fr" ? c.name_fr : c.name_en}
                      </span>
                    </div>
                    <span className="font-mono text-[12px] font-semibold tabular-nums">
                      {fmtNum(c.count, locale)}
                    </span>
                  </div>
                  <div className="bg-bg relative h-1">
                    <div
                      className={
                        "absolute inset-y-0 left-0 transition-colors " +
                        (isHovered ? "bg-text" : "")
                      }
                      style={{
                        width: `${w}%`,
                        background: isHovered
                          ? "var(--color-text)"
                          : colorFor(c.count),
                      }}
                    />
                  </div>
                  <div className="text-text-faint font-mono text-[9.5px] tracking-wider">
                    {pct.toFixed(2)}% · {c.iso3}
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </div>
  )
}

export default Origins

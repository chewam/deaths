import Label from "@/components/atoms/Label"

type StatProps = {
  label: string
  value: string | number
  unit?: string
  sub?: string
  delta?: number
  deltaLabel?: string
  big?: boolean
  /** -1..1 — positive values shade the value as danger (death-rate increase). */
  colorize?: number
}

const Stat = ({
  label,
  value,
  unit,
  sub,
  delta,
  deltaLabel,
  big,
  colorize,
}: StatProps) => {
  const valueCls = [
    "font-display tracking-display tabular-nums leading-[0.95]",
    big ? "text-[56px]" : "text-[36px]",
    colorize != null && colorize > 0.5
      ? "text-danger"
      : colorize != null && colorize < -0.5
        ? "text-green-600"
        : "text-text",
  ].join(" ")

  const unitCls = [
    "font-mono tabular-nums text-text-dim",
    big ? "text-[22px]" : "text-[16px]",
  ].join(" ")

  const deltaSign = delta == null ? 0 : Math.sign(delta)
  const deltaCls = [
    "font-mono tabular-nums text-[11px] mt-1",
    deltaSign > 0
      ? "text-danger"
      : deltaSign < 0
        ? "text-green-600"
        : "text-text-dim",
  ].join(" ")
  const deltaArrow = deltaSign > 0 ? "↑" : deltaSign < 0 ? "↓" : "—"

  return (
    <div className="bg-surface flex flex-col gap-2 px-7 py-6">
      <Label>{label}</Label>
      <div className="flex items-baseline gap-1.5">
        <div className={valueCls}>{value}</div>
        {unit && <div className={unitCls}>{unit}</div>}
      </div>
      {sub && (
        <div className="font-mono text-text-faint text-[11.5px] tracking-[0.05em]">
          {sub}
        </div>
      )}
      {delta != null && (
        <div className={deltaCls}>
          {deltaArrow} {Math.abs(delta).toFixed(2)}%{" "}
          {deltaLabel && <span className="text-text-faint">{deltaLabel}</span>}
        </div>
      )}
    </div>
  )
}

export default Stat

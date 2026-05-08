import { useIntl } from "react-intl"

interface Props {
  value: [number, number]
  onChange: (value: [number, number]) => void
}

const MIN = 0
const MAX = 110
const STEP = 10

const AgeRange = ({ value, onChange }: Props) => {
  const intl = useIntl()
  const [low, high] = value

  const sliderCls =
    "absolute inset-0 w-full appearance-none bg-transparent " +
    "pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto " +
    "[&::-moz-range-thumb]:pointer-events-auto"

  return (
    <div
      data-testid="filter-age-range"
      className="relative h-3.5 flex items-center"
    >
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-border" />
      <input
        type="range"
        aria-label={intl.formatMessage({ id: "Age minimum" })}
        min={MIN}
        max={high - STEP}
        step={STEP}
        value={low}
        onChange={(e) => onChange([Number(e.target.value), high])}
        className={sliderCls}
      />
      <input
        type="range"
        aria-label={intl.formatMessage({ id: "Age maximum" })}
        min={low + STEP}
        max={MAX}
        step={STEP}
        value={high}
        onChange={(e) => onChange([low, Number(e.target.value)])}
        className={sliderCls}
      />
    </div>
  )
}

export default AgeRange

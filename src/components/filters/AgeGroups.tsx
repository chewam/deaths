import Slider from "rc-slider"

import "rc-slider/assets/index.css"

interface Props {
  onChange: (value: [number, number]) => void
}

const marks = {
  "0": "0",
  10: "10",
  20: "20",
  30: "30",
  40: "40",
  50: "50",
  60: "60",
  70: "70",
  80: "80",
  90: "90",
  100: "100",
  110: "110+",
}

const AgeGroups = ({ onChange }: Props) => (
  <>
    <Slider
      range
      min={0}
      max={110}
      step={null}
      marks={marks}
      allowCross={false}
      defaultValue={[0, 110]}
      onChange={(value) => onChange(value as [number, number])}
    />
  </>
)

export default AgeGroups

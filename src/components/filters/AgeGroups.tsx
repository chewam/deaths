// import Slider from "@material-ui/core/Slider"
import Slider from "rc-slider"

import "rc-slider/assets/index.css"

interface Props {
  onChange: (value: [number, number]) => void
}

// const marks = [
//   { value: 0, label: "0" },
//   { value: 10, label: "10" },
//   { value: 20, label: "20" },
//   { value: 30, label: "30" },
//   { value: 40, label: "40" },
//   { value: 50, label: "50" },
//   { value: 60, label: "60" },
//   { value: 70, label: "70" },
//   { value: 80, label: "80" },
//   { value: 90, label: "90" },
//   { value: 100, label: "100" },
//   { value: 110, label: "110+" },
// ]

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

const AgeGroups = ({ onChange }: Props): JSX.Element => {
  // const getTextValue = (value: number) => `${value}`

  return (
    <>
      <Slider
        range
        min={0}
        max={110}
        step={null}
        marks={marks}
        allowCross={false}
        defaultValue={[0, 110]}
        // onChange={(value) => console.log(value)}
        onChange={(value) => onChange(value as [number, number])}
      />
    </>
    // <Slider
    //   step={10}
    //   max={110}
    //   marks={marks}
    //   className="slider"
    //   defaultValue={[0, 110]}
    //   getAriaLabel={() => "slider"}
    //   getAriaValueText={getTextValue}
    //   onChange={(event, value) => onChange(value as [number, number])}
    // />
  )
}

export default AgeGroups

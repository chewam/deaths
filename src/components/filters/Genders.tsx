import { FormattedMessage as Trans } from "react-intl"

import { Pill } from "@/components/atoms"

interface Props {
  value: Gender
  onChange: (gender: Gender) => void
}

const Genders = ({ value, onChange }: Props) => (
  <div className="inline-flex">
    <Pill
      active={value === null}
      aria-pressed={value === null}
      data-testid="filter-gender-all"
      onClick={() => onChange(null)}
    >
      <Trans id="all" />
    </Pill>
    <Pill
      active={value === "male"}
      aria-pressed={value === "male"}
      data-testid="filter-gender-male"
      className="-ml-px"
      onClick={() => onChange("male")}
    >
      <span aria-hidden="true">♂</span> <Trans id="males" />
    </Pill>
    <Pill
      active={value === "female"}
      aria-pressed={value === "female"}
      data-testid="filter-gender-female"
      className="-ml-px"
      onClick={() => onChange("female")}
    >
      <span aria-hidden="true">♀</span> <Trans id="females" />
    </Pill>
  </div>
)

export default Genders

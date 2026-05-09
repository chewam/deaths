import { FormattedMessage as Trans } from "react-intl"

import useFilters from "@/services/filters"
import { Label } from "@/components/atoms"
import Genders from "@/components/filters/Genders"
import AgeRange from "@/components/filters/AgeRange"

const formatAge = (n: number) => (n >= 110 ? "110+" : String(n))

const FiltersBar = () => {
  const [filters, setFilters] = useFilters()

  const { ageGroup, gender = null } = filters as Filters

  return (
    <div className="border-border border-b px-12 py-3.5 flex flex-wrap items-center gap-8">
      <div className="flex flex-col gap-1.5 min-w-[220px]">
        <div className="flex items-center justify-between gap-3">
          <Label>
            <Trans id="Age" />
          </Label>
          <span className="font-mono text-xs text-text">
            {formatAge(ageGroup[0])}–{formatAge(ageGroup[1])}
          </span>
        </div>
        <AgeRange
          value={ageGroup}
          onChange={(next) => setFilters({ ageGroup: next, gender })}
        />
      </div>
      <div className="flex items-center gap-2">
        <Label>
          <Trans id="Gender" />
        </Label>
        <Genders
          value={gender}
          onChange={(next) => setFilters({ ageGroup, gender: next })}
        />
      </div>
    </div>
  )
}

export default FiltersBar

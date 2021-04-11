import Map from "./Map"
import Panel from "@/components/Panel"
import ReactTooltip from "react-tooltip"
import Filters from "@/components/Filters"
import { useEffect, useState } from "react"

const Locations = (): JSX.Element => {
  const [tooltip, setTooltip] = useState("")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <Panel className="locations">
      <div style={{ flex: 1, position: "relative", overflow: "auto" }}>
        <Map onOver={setTooltip} />
      </div>
      {isMounted && <ReactTooltip>{tooltip}</ReactTooltip>}
      <Filters />
    </Panel>
  )
}

export default Locations

import { useEffect, useState } from "react"
import Panel from "@/components/Panel"
import Map from "./Map"
// import Filters from "./Filters"
import Filters from "@/views/Deaths/Filters"
import ReactTooltip from "react-tooltip"

const Locations = () => {
  const [tooltip, setTooltip] = useState("")
  const [yearIndex, setYearIndex] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <Panel className="locations">
      <Map yearIndex={yearIndex} onOver={setTooltip} />
      {isMounted && <ReactTooltip>{tooltip}</ReactTooltip>}
      <Filters />
      {/* <Filters onChange={(value) => setYearIndex(value)} /> */}
    </Panel>
  )
}

export default Locations

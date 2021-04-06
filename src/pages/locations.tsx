import Locations from "@/views/Locations"

import useRawLocations from "@/services/raw-locations"

const Page = (): JSX.Element => {
  useRawLocations()

  return <Locations />
}

export default Page

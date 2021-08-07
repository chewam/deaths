import useSWR from "swr"

const getData = (deaths: Deaths): Overview => {
  const { labels: deathsLabels, data: deathsData } = deaths
  const data = deathsData.reduce((data, year) => data.concat(year), [])
  const labels = data.map(
    (value, i) => `${deathsLabels[i % 12]} ${2000 + Math.floor(i / 12)}`
  )

  return { labels, data }
}

const useOverview = (): [Overview | undefined, (deaths: Deaths) => void] => {
  const { data, mutate } = useSWR("overview", null, {
    revalidateOnFocus: false,
    initialData: { labels: [], data: [] } as Overview,
  })

  const setData = (deaths: Deaths) => {
    const data = getData(deaths)
    mutate(data, false)
  }

  return [data, setData]
}

export default useOverview

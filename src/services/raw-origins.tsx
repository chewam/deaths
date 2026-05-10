import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const useRawOrigins = (): { data?: OriginsRawData; error?: unknown } => {
  const { data, error } = useSWR<OriginsRawData>(
    "/data/origins.json",
    fetcher,
    {
      revalidateOnFocus: false,
    }
  )
  return { data, error }
}

export default useRawOrigins

import useSWR from "swr"

const useMonths = (): [
  Record<string, []>,
  (
    data?: Record<string, []>,
    shouldRevalidate?: boolean | undefined
  ) => Promise<Record<string, []>>
] => {
  const { data, mutate } = useSWR("months", null, {
    revalidateOnFocus: false,
  })

  return [data, mutate]
}

export default useMonths

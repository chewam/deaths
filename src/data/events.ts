export type RawYearEvent = {
  year: number
  month: number
  labelKey: string
  descKey: string
}

export type YearEvent = {
  year: number
  month: number
  label: string
  desc: string
}

export const EVENTS_RAW: RawYearEvent[] = [
  {
    year: 2003,
    month: 8,
    labelKey: "event.heatwave-2003.label",
    descKey: "event.heatwave-2003.desc",
  },
  {
    year: 2015,
    month: 1,
    labelKey: "event.flu-2015.label",
    descKey: "event.flu-2015.desc",
  },
  {
    year: 2017,
    month: 1,
    labelKey: "event.flu-2017.label",
    descKey: "event.flu-2017.desc",
  },
  {
    year: 2020,
    month: 4,
    labelKey: "event.covid-2020-04.label",
    descKey: "event.covid-2020-04.desc",
  },
  {
    year: 2020,
    month: 11,
    labelKey: "event.covid-2020-11.label",
    descKey: "event.covid-2020-11.desc",
  },
  {
    year: 2022,
    month: 7,
    labelKey: "event.heatwave-2022.label",
    descKey: "event.heatwave-2022.desc",
  },
  {
    year: 2025,
    month: 1,
    labelKey: "event.winter-2025.label",
    descKey: "event.winter-2025.desc",
  },
]

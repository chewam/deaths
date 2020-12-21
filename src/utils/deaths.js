import deaths from "@data/deaths"
import population from "@data/population"
import Months from "@data/months"

export const getTotal = (year) =>
  new Intl.NumberFormat("fr-FR").format(
    deaths.reduce((count, month) => count + (month[year] || 0), 0)
  )

export const getRatio = (year) =>
  (
    (deaths.reduce((count, month) => count + (month[year] || 0), 0) * 100) /
    population[year]
  ).toFixed(2)

export const defaultYears = Object.keys(deaths[0]).reduce(
  (years, year) => (year !== "month" && (years[year] = year > 2016), years),
  {}
)

export const linearDeaths = deaths
  .reduce(
    (result, death) =>
      result.concat(
        Object.keys(death).reduce(
          (months, key) => (
            key !== "month" &&
              months.push({
                year: key,
                value: death[key],
                month: death.month,
                label: `${death.month} ${key}`,
                date: new Date(key, Months.indexOf(death.month), 15).getTime(),
              }),
            months
          ),
          []
        )
      ),
    []
  )
  .sort((a, b) => a.date - b.date)

export const ratioDeaths = Object.keys(deaths[0]).reduce(
  (years, key) => (
    key !== "month" && years.push({ ratio: getRatio(key), year: key }), years
  ),
  []
)

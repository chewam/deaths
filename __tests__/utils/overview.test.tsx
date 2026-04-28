import type { Context } from "chartjs-plugin-datalabels"
import {
  average,
  getDatalabelsDisplay,
} from "../../src/components/charts/Overview"
import deaths from "../../public/data/deaths.json"

const male = (deaths as DeathsRawData).male.global
const female = (deaths as DeathsRawData).female.global

describe("Test average()", () => {
  test("average([0, 10]) => 5", () => {
    const res = average([0, 10])
    expect(res).toBe(5)
  })

  test("regression: average of 2000 male monthly = 23431.667", () => {
    expect(average(male[0])).toBeCloseTo(23431.6667, 4)
  })

  test("regression: average of 2010 m+f monthly = 46396.5", () => {
    const mf = male[10].map((m, i) => m + female[10][i])
    expect(average(mf)).toBeCloseTo(46396.5, 4)
  })

  test("regression: 2020 m+f monthly avg = 56510.417 (COVID year)", () => {
    const mf = male[20].map((m, i) => m + female[20][i])
    expect(average(mf)).toBeCloseTo(56510.4167, 4)
  })
})

describe("Test getDatalabelsDisplay()", () => {
  const data = [
    135735, 133292, 132138, 133322, 123045, 123451, 118190, 115158, 114334,
    110766, 107466, 101719, 101859, 99352, 95805, 98871, 98867, 101879, 104918,
    108202, 122073, 128953, 63272,
  ]

  test("getDatalabelsDisplay({ active: true }) => true", () => {
    const res = getDatalabelsDisplay({
      active: true,
      dataIndex: 0,
      dataset: { data },
    } as Context)
    expect(res).toBe(true)
  })

  test("getDatalabelsDisplay({ active: false }) => auto", () => {
    const res = getDatalabelsDisplay({
      dataIndex: 0,
      active: false,
      dataset: { data },
    } as Context)
    expect(res).toBe("auto")
  })

  test("getDatalabelsDisplay({ active: false }) => false", () => {
    const res = getDatalabelsDisplay({
      active: false,
      dataset: { data },
      dataIndex: data.length - 1,
    } as Context)
    expect(res).toBe(false)
  })
})

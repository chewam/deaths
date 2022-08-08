import type { Context } from "chartjs-plugin-datalabels"
import {
  average,
  getDatalabelsDisplay,
} from "../../src/components/charts/Overview"

describe("Test average()", () => {
  test("average([0, 10]) => 5", () => {
    const res = average([0, 10])
    expect(res).toBe(5)
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

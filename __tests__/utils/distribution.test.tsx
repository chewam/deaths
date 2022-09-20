import type { Context } from "chartjs-plugin-datalabels"
import {
  getLineLabelDisplay,
  getBarLabelDisplay,
  getFormattedLineLabel,
} from "../../src/components/charts/Distribution"

describe("Test getBarLabelDisplay()", () => {
  const data = [
    135735, 133292, 132138, 133322, 123045, 123451, 118190, 115158, 114334,
    110766, 107466, 101719, 101859, 99352, 95805, 98871, 98867, 101879, 104918,
    108202, 122073, 128953, 63272,
  ]

  test("getBarLabelDisplay() => true", () => {
    const res = getBarLabelDisplay({
      chart: { scales: { y: { max: 42 } } },
      active: true,
      dataIndex: 0,
      dataset: { data },
    } as unknown as Context)
    expect(res).toBe(true)
  })

  test("getBarLabelDisplay() => auto", () => {
    const res = getBarLabelDisplay({
      chart: { scales: { y: { max: 42 } } },
      active: false,
      dataIndex: 0,
      dataset: { data },
    } as unknown as Context)
    expect(res).toBe("auto")
  })

  test("getBarLabelDisplay() => false", () => {
    const res = getBarLabelDisplay({
      chart: { scales: { y: { max: 10000000 } } },
      active: false,
      dataIndex: 0,
      dataset: { data },
    } as unknown as Context)
    expect(res).toBe(false)
  })
})

describe("Test getFormattedLineLabel()", () => {
  test("getFormattedLineLabel(10.456789) => 10.46%", () => {
    const res = getFormattedLineLabel(10.456789)
    expect(res).toBe("10.46%")
  })
})

describe("Test getLineLabelDisplay()", () => {
  test("getLineLabelDisplay({ active: true }) => true", () => {
    const res = getLineLabelDisplay({ active: true } as Context)
    expect(res).toBe(true)
  })

  test("getLineLabelDisplay({ active: false }) => auto", () => {
    const res = getLineLabelDisplay({ active: false } as Context)
    expect(res).toBe("auto")
  })
})

import type { Context } from "chartjs-plugin-datalabels"
import {
  getBarDisplay,
  getBarBackgroundColor,
} from "../../src/components/charts/Distribution"

describe("Test getBarBackgroundColor()", () => {
  test("getBarBackgroundColor() => func({active: false})", () => {
    const func = getBarBackgroundColor("#ffffff")
    expect(typeof func).toBe("function")
    expect(func({ active: false } as Context)).toBe("rgba(0, 0, 0, 0)")
  })

  test("getBarBackgroundColor() => func({active: true})", () => {
    const func = getBarBackgroundColor("#ffffff")
    expect(typeof func).toBe("function")
    expect(func({ active: true } as Context)).toBe("rgba(255, 255, 255, 0.9)")
  })
})

describe("Test getBarDisplay()", () => {
  const data = [
    135735, 133292, 132138, 133322, 123045, 123451, 118190, 115158, 114334,
    110766, 107466, 101719, 101859, 99352, 95805, 98871, 98867, 101879, 104918,
    108202, 122073, 128953, 63272,
  ]

  test("getBarDisplay() => true", () => {
    const res = getBarDisplay({
      chart: { scales: { y: { max: 42 } } },
      active: true,
      dataIndex: 0,
      dataset: { data },
    } as unknown as Context)
    expect(res).toBe(true)
  })

  test("getBarDisplay() => auto", () => {
    const res = getBarDisplay({
      chart: { scales: { y: { max: 42 } } },
      active: false,
      dataIndex: 0,
      dataset: { data },
    } as unknown as Context)
    expect(res).toBe("auto")
  })

  test("getBarDisplay() => false", () => {
    const res = getBarDisplay({
      chart: { scales: { y: { max: 10000000 } } },
      active: false,
      dataIndex: 0,
      dataset: { data },
    } as unknown as Context)
    expect(res).toBe(false)
  })
})

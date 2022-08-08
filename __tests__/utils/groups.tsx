import type { Context } from "chartjs-plugin-datalabels"
import {
  getAgeGroupFormatter,
  getAgeGroupDisplay,
  getAgeGroupColor,
  getLabelsColor,
  getLabelsDisplay,
  getLabelsFormatter,
} from "../../src/components/charts/Groups"

describe("Test getAgeGroupFormatter()", () => {
  test("getAgeGroupFormatter(['toto', 'titi']) => func() => 'toto'", () => {
    const func = getAgeGroupFormatter(["toto", "titi"])
    expect(typeof func).toBe("function")
    expect(func(42, { dataIndex: 0 } as Context)).toBe("toto")
  })
})

describe("Test getAgeGroupDisplay()", () => {
  test("getAgeGroupDisplay([20000]) => false", () => {
    const func = getAgeGroupDisplay([20000])
    expect(typeof func).toBe("function")
    expect(func({ dataIndex: 0 } as Context)).toBe(false)
  })

  test("getAgeGroupDisplay([20001]) => true", () => {
    const func = getAgeGroupDisplay([20001])
    expect(typeof func).toBe("function")
    expect(func({ dataIndex: 0 } as Context)).toBe(true)
  })
})

describe("Test getAgeGroupColor()", () => {
  test("getAgeGroupColor(['toto', 'titi']) => func() => 'toto'", () => {
    const func = getAgeGroupColor(["toto", "titi"])
    expect(typeof func).toBe("function")
    expect(func({ dataIndex: 0 } as Context)).toBe("toto")
  })
})

describe("Test getLabelsFormatter()", () => {
  test("getLabelsFormatter(['toto', 'titi']) => func() => 'toto'", () => {
    const func = getLabelsFormatter([42001])
    expect(typeof func).toBe("function")
    expect(func(42, { dataIndex: 0 } as Context)).toBe("42K")
  })
})

describe("Test getLabelsDisplay()", () => {
  test("getLabelsDisplay([20000]) => false", () => {
    const func = getLabelsDisplay([20000])
    expect(typeof func).toBe("function")
    expect(func({ dataIndex: 0 } as Context)).toBe(false)
  })

  test("getLabelsDisplay([20001]) => true", () => {
    const func = getLabelsDisplay([20001])
    expect(typeof func).toBe("function")
    expect(func({ dataIndex: 0 } as Context)).toBe(true)
  })
})

describe("Test getLabelsColor()", () => {
  test("getLabelsColor(['toto', 'titi']) => func() => 'toto'", () => {
    const func = getLabelsColor(["toto", "titi"])
    expect(typeof func).toBe("function")
    expect(func({ dataIndex: 0 } as Context)).toBe("toto")
  })
})

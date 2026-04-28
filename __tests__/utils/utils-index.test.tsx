import {
  sumArray,
  sumObjects,
  sumYears,
  getYearPopulation,
} from "../../src/utils/index"
import deaths from "../../public/data/deaths.json"

const male = (deaths as DeathsRawData).male.global
const female = (deaths as DeathsRawData).female.global

describe("sumArray()", () => {
  test("returns 0 for empty array", () => {
    expect(sumArray([])).toBe(0)
  })

  test("returns 0 when called with no argument (default [])", () => {
    expect(sumArray()).toBe(0)
  })

  test("sums a small array", () => {
    expect(sumArray([1, 2, 3, 4])).toBe(10)
  })

  test("regression: sum of male monthly deaths in 2000 = 281180", () => {
    expect(sumArray(male[0])).toBe(281180)
  })

  test("regression: sum of female monthly deaths in 2000 = 265718", () => {
    expect(sumArray(female[0])).toBe(265718)
  })

  test("regression: total deaths in 2022 (m+f) = 684591", () => {
    expect(sumArray(male[22]) + sumArray(female[22])).toBe(684591)
  })
})

describe("sumObjects()", () => {
  test("merges keys and sums overlapping values", () => {
    expect(sumObjects({ a: 1, b: 2 }, { b: 3, c: 4 })).toEqual({
      a: 1,
      b: 5,
      c: 4,
    })
  })

  test("returns {} for missing args (defaults)", () => {
    expect(sumObjects()).toEqual({})
  })

  test("returns first arg unchanged when second is missing", () => {
    expect(sumObjects({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 })
  })
})

describe("sumYears()", () => {
  test("returns [] when given no years", () => {
    expect(sumYears([])).toEqual([])
  })

  test("regression: male+female monthly deaths in 2000", () => {
    expect(sumYears([male[0], female[0]])).toEqual([
      60482, 49150, 46514, 43939, 42998, 41817, 42897, 42478, 40751, 44715,
      44216, 46941,
    ])
  })

  test("element-wise sum of three arrays of equal length", () => {
    expect(
      sumYears([
        [1, 2, 3],
        [10, 20, 30],
        [100, 200, 300],
      ])
    ).toEqual([111, 222, 333])
  })
})

describe("getYearPopulation()", () => {
  test("returns French population for 2000", () => {
    expect(getYearPopulation(2000)).toBe(60508150)
  })

  test("returns French population for 2010", () => {
    expect(getYearPopulation(2010)).toBe(64612939)
  })

  test("returns French population for 2020", () => {
    expect(getYearPopulation(2020)).toBe(67063703)
  })

  test("returns undefined for years outside the dataset", () => {
    expect(getYearPopulation(1900)).toBeUndefined()
  })
})

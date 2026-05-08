import en from "@/lang/en.json"
import fr from "@/lang/fr.json"

describe("lang/parity", () => {
  test("en.json and fr.json expose the same set of keys", () => {
    const enKeys = Object.keys(en).sort()
    const frKeys = Object.keys(fr).sort()
    expect(frKeys).toEqual(enKeys)
  })

  test("no empty translation values", () => {
    for (const [k, v] of Object.entries(en)) {
      expect(v, `en.json[${k}] is empty`).not.toBe("")
    }
    for (const [k, v] of Object.entries(fr)) {
      expect(v, `fr.json[${k}] is empty`).not.toBe("")
    }
  })
})

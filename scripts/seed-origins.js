#!/usr/bin/env node
"use strict"

/**
 * Seeds public/data/origins.json from the existing aggregate at
 * NEW_VERSION_WORLD/data/origins-sample.json (itself derived from
 * src/data/countries.json). Enriches each country with M49 numeric IDs from
 * insee-country-map (M49 matches world-atlas TopoJSON `id`, used by the map
 * component).
 *
 * Run once to produce the initial public/data/origins.json. Future
 * `yarn fetch` invocations will overwrite this file with fresh aggregates
 * built directly from raw INSEE data via scripts/build.js.
 */

const fs = require("fs")
const path = require("path")

const { NAME_TO_COUNTRY } = require("./insee-country-map")

const SAMPLE = path.join(
  __dirname,
  "..",
  "NEW_VERSION_WORLD",
  "data",
  "origins-sample.json"
)
const OUT = path.join(__dirname, "..", "public", "data", "origins.json")

// Build iso3 → M49 lookup from NAME_TO_COUNTRY
const iso3ToM49 = {}
const iso3ToNameEn = {}
const iso3ToNameFr = {}
for (const [, [iso3, m49, name_en, name_fr]] of Object.entries(NAME_TO_COUNTRY)) {
  iso3ToM49[iso3] = m49
  iso3ToNameEn[iso3] = name_en
  iso3ToNameFr[iso3] = name_fr
}

const sample = JSON.parse(fs.readFileSync(SAMPLE, "utf8"))

const countries = sample.countries
  .map((c) => {
    const m49 = iso3ToM49[c.iso3]
    if (!m49 && c.iso3 !== "XKX") {
      console.warn(`No M49 for ${c.iso3} (${c.name})`)
    }
    return {
      iso3: c.iso3,
      m49: m49 || 0,
      name_en: iso3ToNameEn[c.iso3] || c.name,
      name_fr: iso3ToNameFr[c.iso3] || c.name,
      count: c.count,
    }
  })
  .filter((c) => c.m49 > 0)
  .sort((a, b) => b.count - a.count)

const output = {
  meta: {
    source:
      "Sample derived from src/data/countries.json (will be replaced by build.js on next yarn fetch)",
    generated: new Date().toISOString(),
    bornInFrance: sample.meta.bornInFrance,
    bornInOverseas: sample.meta.bornInFrenchOverseas,
    bornAbroad: countries.reduce((s, c) => s + c.count, 0),
    bornAbroadUnmapped: sample.meta.bornAbroadUnmapped,
    distinctCountries: countries.length,
  },
  countries,
}

fs.writeFileSync(OUT, JSON.stringify(output, null, 2))
console.log(`Wrote ${OUT}`)
console.log(`  Born in France:    ${output.meta.bornInFrance}`)
console.log(`  Born in overseas:  ${output.meta.bornInOverseas}`)
console.log(`  Born abroad:       ${output.meta.bornAbroad}`)
console.log(`  Distinct countries: ${output.meta.distinctCountries}`)
console.log(`  Top 5:`)
countries.slice(0, 5).forEach((c) => {
  console.log(`    ${c.iso3} m49=${c.m49} ${c.name_en.padEnd(20)} ${c.count}`)
})

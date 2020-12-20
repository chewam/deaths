#!/usr/bin/env node

"use strict"

const fs = require("fs")
const util = require("util")
const crypto = require("crypto")
const fetch = require("node-fetch")
const streamPipeline = util.promisify(require("stream").pipeline)

const build = require("./build")

const url =
  "https://www.data.gouv.fr/api/1/datasets/fichier-des-personnes-decedees/"

const download = async (url) => {
  console.log("Downloading", url)
  const fileName = url.split("/")[url.split("/").length - 1]
  const path = `./data/${fileName}`
  const response = await fetch(url)
  if (response.ok) {
    return streamPipeline(response.body, fs.createWriteStream(path))
  }
  throw new Error(`unexpected response ${response.statusText}`)
}

const hash = (text) => crypto.createHash("md5").update(text).digest("hex")

const getDatasetResources = async () => {
  const response = await fetch(url)
  const { resources } = await response.json()
  return resources
}

const getYearlyFiles = (resources) => {
  const files = resources.filter((resource) =>
    resource.title.match(/^deces-20[0-9]\d\.txt$/)
  )
  const year = parseInt(files[0].title.match(/\d{4}/)[0], 10)
  return { files, year }
}

const getMonthlyFiles = (resources, lastYear, currentYear) => {
  let files = []
  for (let year = lastYear + 1; year <= currentYear; year++) {
    var regex = new RegExp(`^deces-${year}-m\\d{2}\\.txt$`)
    const newFiles = resources.filter((resource) => resource.title.match(regex))
    files = files.concat(newFiles)
  }
  return files
}

const getFilesUrls = (yearlyFiles, monthlyFiles) =>
  [...yearlyFiles.reverse(), ...monthlyFiles.reverse()].map((file) => file.url)

const downloadFiles = async (urls) => {
  for (const url of urls) {
    await download(url)
  }
}

const main = async () => {
  const resources = await getDatasetResources()
  console.log("Resources found:", resources.length)

  const { files: yearlyFiles, year: lastYear } = getYearlyFiles(resources)
  console.log("Yearly files found:", yearlyFiles.length)
  console.log("Last yearly file year:", lastYear)

  const currentYear = new Date().getFullYear()
  console.log("Current year:", currentYear)

  const monthlyFiles = getMonthlyFiles(resources, lastYear, currentYear)
  console.log("Monthly files found:", monthlyFiles.length)

  const urls = getFilesUrls(yearlyFiles, monthlyFiles)

  console.log("URLs:", urls)

  await downloadFiles(urls)

  const currentHash = hash(
    fs.readFileSync(`${__dirname}/../src/data/deaths.json`)
  )

  console.log("Current json file hash:", currentHash)

  await build()

  const newHash = hash(fs.readFileSync(`${__dirname}/../src/data/deaths.json`))

  console.log("New json file hash:", newHash)

  if (newHash !== currentHash) {
    console.log("Data update required!")
  } else {
    console.log("No data update required.")
  }
}

main().catch((error) => {
  console.log(error)
})

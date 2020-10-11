"use strict"

var fs = require("fs")
var es = require("event-stream")
var process = require("process")
const crypto = require("crypto")

const baseDir = `${__dirname}/../data`

const Months = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Aout",
  "Septembre",
  "Octobre",
  "Novembre",
  "Decembre",
]

const processData = (data) => {
  const result = []

  for (const key in data) {
    const { year, month } = data[key]
    const index = month - 1
    if (2010 > year || year > 2020) continue
    if (0 > index || index > 12) continue
    if (!result[index]) {
      result[index] = { month: Months[index] }
    }
    if (!result[index][year]) {
      result[index][year] = 0
    }
    result[index][year]++
  }

  return result
}

const getLineHash = (line) =>
  crypto.createHash("md5").update(line).digest("hex")

const readLine = (line) => [
  getLineHash(line),
  parseInt(line.substring(154, 158), 10),
  parseInt(line.substring(158, 160), 10),
]

const readFile = (fileName) => {
  const data = {}

  return new Promise((resolve) => {
    fs.createReadStream(`${baseDir}/${fileName}`)
      .pipe(es.split())
      .pipe(
        es
          .mapSync((line) => {
            const [hash, year, month] = readLine(line)
            if (Number.isInteger(year) && Number.isInteger(month)) {
              data[hash] = { year, month }
            }
          })
          .on("error", (err) => console.log("Error while reading file.", err))
          .on("end", () => resolve(data))
      )
  })
}

const getFilesData = async (files) => {
  let data = {}
  for (let i = 0, l = files.length; i < l; i++) {
    console.log(`File ${i + 1}/${l}:`, files[i])
    Object.assign(data, await readFile(files[i]))
  }
  return data
}

const getFiles = () => {
  return new Promise((resolve) => {
    fs.readdir(baseDir, (err, files) => {
      if (err) {
        console.error("Could not list the directory.", err)
        process.exit(1)
      }
      resolve(files.filter((file) => file.match(/^.+\.txt$/)))
    })
  })
}

const main = async () => {
  const files = await getFiles()
  const resultFilePath = `${__dirname}/../src/data/deaths.json`
  const data = await getFilesData(files)
  console.log(
    "File processing done:",
    Object.keys(data).length,
    "records found."
  )
  fs.writeFileSync(resultFilePath, JSON.stringify(processData(data)))
  console.log("Result written into", resultFilePath)
}

main()
// module.exports = main

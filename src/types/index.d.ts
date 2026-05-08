type Gender = "male" | "female" | null

type Filters = {
  ageGroup: [number, number]
  gender?: Gender
}

type Population = {
  [key: number]: number
}

type DeathsAgeGroups = number[][][]

interface DeathsRawData {
  labels: string[]
  ageGroups: DeathsAgeGroups
  female: { ageGroups: DeathsAgeGroups; global: number[][] }
  male: { ageGroups: DeathsAgeGroups; global: number[][] }
}

interface Deaths {
  labels: string[]
  data: number[][]
}

interface Overview {
  labels: string[]
  data: number[]
}

interface MortalityRawData {
  labels: string[]
  ageGroups: number[][]
  female: { ageGroups: number[][]; global: number[][] }
  male: { ageGroups: number[][]; global: number[][] }
}

interface Mortality {
  labels: string[]
  ratio: number[]
  data: number[][]
  ageGroups: number[]
}

interface Years {
  [key: string]: boolean
}

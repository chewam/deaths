declare module "google-palette"

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

type MortalityAgeGroups = number[][]

interface MortalityRawData {
  labels: string[]
  ageGroups: MortalityAgeGroups
  female: { ageGroups: MortalityAgeGroups; global: number[][] }
  male: { ageGroups: MortalityAgeGroups; global: number[][] }
}

interface Mortality {
  labels: string[]
  ratio: number[]
  data: number[][]
  ageGroups: number[]
}

type LocationsAgeGroups = Record<number, number>[][]

interface LocationsRawData {
  ageGroups: LocationsAgeGroups
  female: { ageGroups: LocationsAgeGroups }
  male: { ageGroups: LocationsAgeGroups }
}

type Locations = Record<string, number>[]

interface Years {
  [key: string]: boolean
}

interface Theme {
  theme: string | undefined
  values: Record<string, string>
  setTheme: (theme: string) => void
  setValues: (values: Record<string, Record<string, string>>) => void
}

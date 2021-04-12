import "@testing-library/jest-dom/extend-expect"

// const MockResponsiveContainer = (props) => <div {...props} />

// jest.mock("recharts", () => ({
//   ...jest.requireActual("recharts"),
//   ResponsiveContainer: MockResponsiveContainer,
// }))

jest.mock("react-chartjs-2", () => ({
  Line: () => null,
  Bar: () => null,
}))

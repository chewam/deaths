import "@testing-library/jest-dom/extend-expect"

const MockResponsiveContainer = (props) => <div {...props} />

jest.mock("recharts", () => ({
  ...jest.requireActual("recharts"),
  ResponsiveContainer: MockResponsiveContainer,
}))

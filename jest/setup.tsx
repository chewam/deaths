import "@testing-library/jest-dom/extend-expect"

jest.mock("react-chartjs-2", () => ({
  Bar: () => null,
  Line: () => null,
  Doughnut: () => null,
}))

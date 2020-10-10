import React from "react"
import { render } from "@testing-library/react"
import "@testing-library/jest-dom/extend-expect"

import Index from "../src/pages/index"

test("renders header title", () => {
  const { getByText } = render(<Index />)
  const headerElement = getByText(/Décès annuels en France/)
  expect(headerElement).toBeInTheDocument()
})

import { render } from "@testing-library/react"
import { ThemeProvider } from "next-themes"
import Switch from "@/components/Switch"

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

describe("Switch", () => {
  test("should create a Switch in light mode", () => {
    const { asFragment } = render(
      <ThemeProvider defaultTheme="light">
        <Switch />
      </ThemeProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  test("should create a Switch in dark mode", () => {
    const { asFragment } = render(
      <ThemeProvider
        defaultTheme="dark"
        forcedTheme="dark"
        themes={["light", "dark"]}
      >
        <Switch />
      </ThemeProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })
})

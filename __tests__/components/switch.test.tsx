/**
 * @jest-environment jsdom
 */
import messages from "@/lang/fr.json"
import Switch from "@/components/Switch"
import { IntlProvider } from "react-intl"
import { ThemeProvider } from "next-themes"
import { render } from "@testing-library/react"

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
      <IntlProvider locale="fr" messages={messages}>
        <ThemeProvider defaultTheme="light">
          <Switch />
        </ThemeProvider>
      </IntlProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  test("should create a Switch in dark mode", () => {
    const { asFragment } = render(
      <IntlProvider locale="fr" messages={messages}>
        <ThemeProvider
          defaultTheme="dark"
          forcedTheme="dark"
          themes={["light", "dark"]}
        >
          <Switch />
        </ThemeProvider>
      </IntlProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })
})

import messages from "@/lang/fr.json"
import FiltersBar from "@/components/FiltersBar"
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

jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      locale: "fr",
      defaultLocale: "en",
    }
  },
}))

/* eslint @typescript-eslint/no-var-requires: "off" */
const useRouter = jest.spyOn(require("next/router"), "useRouter")

describe("Filters Bar", () => {
  test("should create a visible Filters Bar", () => {
    useRouter.mockImplementation(() => ({
      route: "/comparison",
    }))
    const { asFragment } = render(
      <IntlProvider locale="fr" messages={messages}>
        <ThemeProvider defaultTheme="light">
          <FiltersBar />
        </ThemeProvider>
      </IntlProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  test("should create a hidden Filters Bar", () => {
    useRouter.mockImplementation(() => ({
      route: "/",
    }))
    const { asFragment } = render(
      <IntlProvider locale="fr" messages={messages}>
        <ThemeProvider
          defaultTheme="dark"
          forcedTheme="dark"
          themes={["light", "dark"]}
        >
          <FiltersBar />
        </ThemeProvider>
      </IntlProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })
})

import messages from "@/lang/fr.json"
import FiltersBar from "@/components/FiltersBar"
import { IntlProvider } from "react-intl"
import { ThemeProvider } from "next-themes"
import { render } from "@testing-library/react"

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

vi.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      locale: "fr",
      defaultLocale: "en",
    }
  },
}))

/* eslint @typescript-eslint/no-var-requires: "off" */
const useRouter = vi.spyOn(require("next/router"), "useRouter")

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

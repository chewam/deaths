import messages from "@/lang/fr.json"
import FiltersBar from "@/components/FiltersBar"
import { IntlProvider } from "react-intl"
import { ThemeProvider } from "next-themes"
import { render } from "@testing-library/react"
import { useRouter } from "next/router"

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
  useRouter: vi.fn(() => ({
    route: "/",
    locale: "fr",
    defaultLocale: "en",
  })),
}))

const mockUseRouter = vi.mocked(useRouter) as unknown as ReturnType<typeof vi.fn>

describe("Filters Bar", () => {
  test("should create a visible Filters Bar", () => {
    mockUseRouter.mockImplementation(() => ({
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
    mockUseRouter.mockImplementation(() => ({
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

import messages from "@/lang/fr.json"
import FiltersBar from "@/components/FiltersBar"
import { IntlProvider } from "react-intl"
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

describe("Filters Bar", () => {
  test("renders identically on every route", () => {
    const { asFragment } = render(
      <IntlProvider locale="fr" messages={messages}>
        <FiltersBar />
      </IntlProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })
})

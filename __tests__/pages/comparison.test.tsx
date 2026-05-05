import messages from "@/lang/fr.json"
import { IntlProvider } from "react-intl"
import { render } from "@testing-library/react"
import { ResizeObserver as ResizeObserverPolyfill } from "@juggle/resize-observer"

import Page from "../../src/pages/comparison"

if (typeof window !== "undefined") {
  window.ResizeObserver = window.ResizeObserver || ResizeObserverPolyfill
}

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
      locale: "fr",
      defaultLocale: "fr",
      isReady: true,
      pathname: "/comparison",
      query: {},
      replace: vi.fn(),
    }
  },
}))

test("Page snapshot: comparison", () => {
  const { asFragment } = render(
    <IntlProvider locale="fr" messages={messages}>
      <Page />
    </IntlProvider>
  )
  expect(asFragment()).toMatchSnapshot()
})

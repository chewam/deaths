import messages from "@/lang/fr.json"
import { IntlProvider } from "react-intl"
import { render } from "@testing-library/react"
import { ResizeObserver as ResizeObserverPolyfill } from "@juggle/resize-observer"

import Page from "../../src/pages/distribution"

if (typeof window !== "undefined") {
  window.ResizeObserver = window.ResizeObserver || ResizeObserverPolyfill
}

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
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
    }
  },
}))

const labels = ["2020", "2021", "2022"]
const ageGroupStub = (base: number) =>
  Array.from({ length: labels.length }, (_, i) => base + i * 100)

vi.mock("@/services/raw-mortality", () => ({
  default: () => [
    {
      labels,
      ageGroups: Array.from({ length: 10 }, (_, i) =>
        ageGroupStub(1_000 * (i + 1))
      ),
      male: {
        ageGroups: Array.from({ length: 10 }, (_, i) =>
          ageGroupStub(500 * (i + 1))
        ),
        global: [],
      },
      female: {
        ageGroups: Array.from({ length: 10 }, (_, i) =>
          ageGroupStub(500 * (i + 1))
        ),
        global: [],
      },
    },
  ],
}))

test("Page snapshot: distribution", () => {
  const { asFragment } = render(
    <IntlProvider locale="fr" messages={messages}>
      <Page />
    </IntlProvider>
  )
  expect(asFragment()).toMatchSnapshot()
})

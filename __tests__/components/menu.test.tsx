import fr from "@/lang/fr.json"
import en from "@/lang/en.json"
import Menu from "@/components/Menu"
import { IntlProvider } from "react-intl"
import { render } from "@testing-library/react"
import { useRouter } from "next/router"

const messages = { en, fr }

vi.mock("next/router", () => ({
  useRouter: vi.fn(() => ({
    route: "/",
    locale: "fr",
    defaultLocale: "en",
  })),
}))

const mockUseRouter = vi.mocked(useRouter) as unknown as ReturnType<typeof vi.fn>

describe("Menu", () => {
  test("should create a Menu in french", () => {
    const lang = "fr"

    mockUseRouter.mockImplementation(() => ({
      route: "/",
    }))

    const { asFragment } = render(
      <IntlProvider locale={lang} messages={messages[lang]}>
        <Menu />
      </IntlProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  test("should create a Menu in english", () => {
    const lang = "en"

    mockUseRouter.mockImplementation(() => ({
      route: "/",
    }))

    const { asFragment } = render(
      <IntlProvider locale={lang} messages={messages[lang]}>
        <Menu />
      </IntlProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })
})

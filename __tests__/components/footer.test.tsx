import fr from "@/lang/fr.json"
import en from "@/lang/en.json"
import Footer from "@/components/Footer"
import { IntlProvider } from "react-intl"
import { render } from "@testing-library/react"
import { useRouter } from "next/router"

const messages = { en, fr }

vi.mock("next/router", () => ({
  useRouter: vi.fn(() => ({
    locale: "fr",
    pathname: "/",
    defaultLocale: "en",
  })),
}))

const mockUseRouter = vi.mocked(useRouter) as unknown as ReturnType<typeof vi.fn>

describe("Footer", () => {
  test("should create a Footer in french", () => {
    const lang = "fr"

    mockUseRouter.mockImplementation(() => ({
      locale: lang,
      pathname: "/",
    }))

    const { asFragment } = render(
      <IntlProvider locale={lang} messages={messages[lang]}>
        <Footer />
      </IntlProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  test("should create a Footer in english", () => {
    const lang = "en"

    mockUseRouter.mockImplementation(() => ({
      locale: lang,
      pathname: "/",
    }))

    const { asFragment } = render(
      <IntlProvider locale={lang} messages={messages[lang]}>
        <Footer />
      </IntlProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })
})

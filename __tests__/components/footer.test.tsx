import fr from "@/lang/fr.json"
import en from "@/lang/en.json"
import Footer from "@/components/Footer"
import { IntlProvider } from "react-intl"
import { render } from "@testing-library/react"

const messages = { en, fr }

jest.mock("next/router", () => ({
  useRouter() {
    return {
      locale: "fr",
      pathname: "/",
      defaultLocale: "en",
    }
  },
}))

/* eslint @typescript-eslint/no-var-requires: "off" */
const useRouter = jest.spyOn(require("next/router"), "useRouter")

describe("Footer", () => {
  test("should create a Footer in french", () => {
    const lang = "fr"

    useRouter.mockImplementation(() => ({
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

    useRouter.mockImplementation(() => ({
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

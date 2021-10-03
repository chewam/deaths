/**
 * @jest-environment jsdom
 */
import fr from "@/lang/fr.json"
import en from "@/lang/en.json"
import Header from "@/components/Header"
import { IntlProvider } from "react-intl"
import { render } from "@testing-library/react"

const messages = { en, fr }

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

describe("Header", () => {
  test("should create a Header in french", () => {
    const lang = "fr"

    useRouter.mockImplementation(() => ({
      route: "/",
    }))

    const { asFragment } = render(
      <IntlProvider locale={lang} messages={messages[lang]}>
        <Header />
      </IntlProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  test("should create a Header in english", () => {
    const lang = "en"

    useRouter.mockImplementation(() => ({
      route: "/",
    }))

    const { asFragment } = render(
      <IntlProvider locale={lang} messages={messages[lang]}>
        <Header />
      </IntlProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })
})

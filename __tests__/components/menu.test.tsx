/**
 * @jest-environment jsdom
 */
import fr from "@/lang/fr.json"
import en from "@/lang/en.json"
import Menu from "@/components/Menu"
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

describe("Menu", () => {
  test("should create a Menu in french", () => {
    const lang = "fr"

    useRouter.mockImplementation(() => ({
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

    useRouter.mockImplementation(() => ({
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

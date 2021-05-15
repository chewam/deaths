import fr from "@/lang/fr.json"
import en from "@/lang/en.json"
import Menu from "@/components/Menu"
import { IntlProvider } from "react-intl"
import { render } from "@testing-library/react"

const messages = { en, fr }

describe("Menu", () => {
  test("should create a Menu in french", () => {
    const lang = "fr"

    const { asFragment } = render(
      <IntlProvider locale={lang} messages={messages[lang]}>
        <Menu />
      </IntlProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  test("should create a Menu in english", () => {
    const lang = "en"

    const { asFragment } = render(
      <IntlProvider locale={lang} messages={messages[lang]}>
        <Menu />
      </IntlProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })
})

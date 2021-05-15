import fr from "@/lang/fr.json"
import en from "@/lang/en.json"
import Header from "@/components/Header"
import { IntlProvider } from "react-intl"
import { render } from "@testing-library/react"

const messages = { en, fr }

describe("Header", () => {
  test("should create a Header in french", () => {
    const lang = "fr"

    const { asFragment } = render(
      <IntlProvider locale={lang} messages={messages[lang]}>
        <Header />
      </IntlProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  test("should create a Header in english", () => {
    const lang = "en"

    const { asFragment } = render(
      <IntlProvider locale={lang} messages={messages[lang]}>
        <Header />
      </IntlProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })
})

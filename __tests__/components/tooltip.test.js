import { render } from "@testing-library/react"

import Tooltip from "@components/Tooltip"

describe("Overview Tooltip", () => {
  test("should create a simple tooltip", () => {
    const label = "toto"
    const payload = [
      { name: "tata", value: 42, color: "blue" },
      { name: "titi", value: 7, color: "red" },
    ]
    const { asFragment } = render(
      <Tooltip
        active={true}
        label={label}
        payload={payload}
        renderer={(payload) =>
          payload.reverse().map((item, i) => (
            <div key={i} style={{ color: item.color }}>
              {item.name}: {new Intl.NumberFormat("fr-FR").format(item.value)}
            </div>
          ))
        }
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  test("should not create a tooltip", () => {
    const { asFragment } = render(<Tooltip active={false} />)
    expect(asFragment()).toMatchSnapshot()
  })
})

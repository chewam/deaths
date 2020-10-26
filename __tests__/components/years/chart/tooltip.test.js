import { render } from "@testing-library/react"

import Tooltip from "@components/years/chart/Tooltip"

describe("Years Tooltip", () => {
  test("should create a simple tooltip", () => {
    const label = "toto"
    const payload = [
      { name: "tata", value: 42, color: "blue" },
      { name: "titi", value: 7, color: "red" },
    ]
    const { asFragment } = render(
      <Tooltip active={true} payload={payload} label={label} />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  test("should not create a tooltip", () => {
    const { asFragment } = render(<Tooltip active={false} />)
    expect(asFragment()).toMatchSnapshot()
  })
})

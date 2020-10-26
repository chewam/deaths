import { render } from "@testing-library/react"

import Tooltip from "@components/overview/Tooltip"

describe("Overview Tooltip", () => {
  test("should create a simple tooltip", () => {
    const label = "toto"
    const payload = [{ value: 42 }]
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

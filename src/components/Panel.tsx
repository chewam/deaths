import { ReactNode } from "react"

type Props = {
  children?: ReactNode
  className: string
}

const Panel = ({ children, className }: Props): JSX.Element => (
  <div className={`panel ${className}`}>{children}</div>
)

export default Panel

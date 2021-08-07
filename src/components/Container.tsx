import { ReactNode } from "react"

type Props = {
  className: string
  hidden?: boolean
  children?: ReactNode
}

const Container = ({ children, className, hidden }: Props): JSX.Element => (
  <div className={`container ${className} ${hidden ? "hidden" : ""}`}>
    {children}
  </div>
)

export default Container

import { ReactNode } from "react"

type Props = {
  className: string
  hidden?: boolean
  children?: ReactNode
}

const Container = ({ children, className, hidden }: Props) => (
  <div className={`container ${className} ${hidden ? "hidden" : ""}`}>
    {children}
  </div>
)

export default Container

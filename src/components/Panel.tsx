import type { ReactNode } from "react"
import Container from "@/components/Container"

type Props = {
  className?: string
  hidden?: boolean
  children?: ReactNode
}

const Panel = ({ children, className, hidden }: Props) => (
  <Container className={`panel ${className || ""}`} hidden={hidden}>
    {children}
  </Container>
)

export default Panel

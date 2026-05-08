import type { HTMLAttributes } from "react"

type CardProps = HTMLAttributes<HTMLDivElement>

const cls = "bg-surface border border-border p-7"

const Card = ({ className, ...rest }: CardProps) => (
  <div className={[cls, className ?? ""].filter(Boolean).join(" ")} {...rest} />
)

export default Card

import type { HTMLAttributes } from "react"

type LabelProps = HTMLAttributes<HTMLSpanElement>

const cls = "font-mono text-[10px] tracking-[0.1em] uppercase text-text-faint"

const Label = ({ className, ...rest }: LabelProps) => (
  <span
    className={[cls, className ?? ""].filter(Boolean).join(" ")}
    {...rest}
  />
)

export default Label

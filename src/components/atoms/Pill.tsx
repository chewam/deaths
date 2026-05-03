import type { ButtonHTMLAttributes } from "react"

type PillProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean
}

const base =
  "font-mono text-[10.5px] tracking-[0.08em] uppercase px-[9px] py-[5px] " +
  "border cursor-pointer transition-all duration-150 " +
  "border-border bg-surface text-text-dim " +
  "hover:text-text hover:border-text-faint"

const activeCls = "bg-text text-bg border-text hover:text-bg hover:border-text"

const Pill = ({ active, className, type, ...rest }: PillProps) => (
  <button
    type={type ?? "button"}
    className={[base, active ? activeCls : "", className ?? ""]
      .filter(Boolean)
      .join(" ")}
    {...rest}
  />
)

export default Pill

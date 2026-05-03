import type { ButtonHTMLAttributes } from "react"

type NavBtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean
}

const base =
  "font-mono text-[11.5px] tracking-[0.08em] uppercase px-[14px] py-[8px] " +
  "border border-transparent bg-transparent cursor-pointer transition-all duration-200 " +
  "text-text-dim hover:text-text"

const activeCls = "text-text border-border bg-surface"

const NavBtn = ({ active, className, type, ...rest }: NavBtnProps) => (
  <button
    type={type ?? "button"}
    className={[base, active ? activeCls : "", className ?? ""]
      .filter(Boolean)
      .join(" ")}
    {...rest}
  />
)

export default NavBtn

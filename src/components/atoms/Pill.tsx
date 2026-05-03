import Link, { type LinkProps } from "next/link"
import type { ButtonHTMLAttributes, ReactNode } from "react"

type Common = {
  active?: boolean
  className?: string
  children?: ReactNode
}

type AsButton = Common &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined
  }

type AsLink = Common &
  Omit<LinkProps, "className"> & {
    title?: string
  }

type PillProps = AsButton | AsLink

const base =
  "font-mono text-[10.5px] tracking-[0.08em] uppercase px-[9px] py-[5px] " +
  "border cursor-pointer transition-all duration-150 " +
  "border-border bg-surface text-text-dim " +
  "hover:text-text hover:border-text-faint"

const activeCls = "bg-text text-bg border-text hover:text-bg hover:border-text"

const Pill = (props: PillProps) => {
  const { active, className, children, ...rest } = props
  const cls = [base, active ? activeCls : "", className ?? ""]
    .filter(Boolean)
    .join(" ")

  if ("href" in rest && rest.href !== undefined) {
    const linkProps = rest as Omit<LinkProps, "className"> & { title?: string }
    return (
      <Link className={cls} {...linkProps}>
        {children}
      </Link>
    )
  }

  const btnProps = rest as Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "className" | "children"
  >
  return (
    <button type={btnProps.type ?? "button"} className={cls} {...btnProps}>
      {children}
    </button>
  )
}

export default Pill

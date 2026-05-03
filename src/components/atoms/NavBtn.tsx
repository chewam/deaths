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

type NavBtnProps = AsButton | AsLink

const base =
  "font-mono text-[11.5px] tracking-[0.08em] uppercase px-[14px] py-[8px] " +
  "border border-transparent bg-transparent cursor-pointer transition-all duration-200 " +
  "text-text-dim hover:text-text"

const activeCls = "text-text border-border bg-surface"

const NavBtn = (props: NavBtnProps) => {
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

export default NavBtn

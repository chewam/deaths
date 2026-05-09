import Label from "@/components/atoms/Label"

type MiniProps = {
  label: string
  value: string | number
}

const Mini = ({ label, value }: MiniProps) => (
  <div className="flex flex-col gap-[3px]">
    <Label>{label}</Label>
    <div className="font-mono tabular-nums text-text text-[13px] font-semibold">
      {value}
    </div>
  </div>
)

export default Mini

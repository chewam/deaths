import useYears from "@/services/years"
import { Button, ButtonGroup } from "@/components/Buttons"

const Filters = ({ onChange }) => {
  const [years] = useYears()

  return (
    <ButtonGroup selectedIndex={0} onChange={onChange}>
      {Object.keys(years)
        .sort((a, b) => +b - +a)
        .map((year, i) => (
          <Button key={i} active={i === 0}>
            {year}
          </Button>
        ))}
    </ButtonGroup>
  )
}

export default Filters

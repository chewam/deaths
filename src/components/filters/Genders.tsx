import { useIntl } from "react-intl"
import { useState, useEffect } from "react"

interface Props {
  onChange: (gender: Gender) => void
}

const Genders = ({ onChange }: Props): JSX.Element => {
  const { formatMessage: fm } = useIntl()
  const [gender, setGender] = useState(null as Gender)

  useEffect(() => onChange(gender), [gender, onChange])

  return (
    <div className="genders">
      <i
        tabIndex={0}
        role="checkbox"
        aria-hidden="true"
        aria-checked="false"
        title={fm({ id: "males" })}
        onClick={() => setGender(gender === "male" ? null : "male")}
        className={`ri-men-line ${gender === "male" ? "active" : ""}`}
      ></i>
      <i
        tabIndex={0}
        role="checkbox"
        aria-hidden="true"
        aria-checked="false"
        title={fm({ id: "females" })}
        onClick={() => setGender(gender === "female" ? null : "female")}
        className={`ri-women-line ${gender === "female" ? "active" : ""}`}
      ></i>
    </div>
  )
}

export default Genders

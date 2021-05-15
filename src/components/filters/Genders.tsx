import { useIntl } from "react-intl"
import { useState, useEffect } from "react"
import { IoMaleSharp, IoFemaleSharp } from "react-icons/io5"
interface Props {
  onChange: (gender: Gender) => void
}

const Genders = ({ onChange }: Props): JSX.Element => {
  const { formatMessage: fm } = useIntl()
  const [gender, setGender] = useState(null as Gender)

  useEffect(() => onChange(gender), [gender, onChange])

  return (
    <div className="genders">
      <IoMaleSharp
        size={28}
        title={fm({ id: "males" })}
        className={`icon ${gender === "male" ? "active" : ""}`}
        onClick={() => setGender(gender === "male" ? null : "male")}
      />
      <IoFemaleSharp
        size={28}
        title={fm({ id: "females" })}
        className={`icon ${gender === "female" ? "active" : ""}`}
        onClick={() => setGender(gender === "female" ? null : "female")}
      />
    </div>
  )
}

export default Genders

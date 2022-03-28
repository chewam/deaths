import { useIntl } from "react-intl"
import { useState, useEffect } from "react"
// import { IoMaleSharp, IoFemaleSharp } from "react-icons/io5"
interface Props {
  onChange: (gender: Gender) => void
}

const Genders = ({ onChange }: Props): JSX.Element => {
  const { formatMessage: fm } = useIntl()
  const [gender, setGender] = useState(null as Gender)

  useEffect(() => onChange(gender), [gender, onChange])

  return (
    <div className="genders">
      {/* <IoMaleSharp
        size={28}
        title={fm({ id: "males" })}
        className={`icon ${gender === "male" ? "active" : ""}`}
        onClick={() => setGender(gender === "male" ? null : "male")}
      /> */}
      <i
        tabIndex={0}
        role="checkbox"
        aria-hidden="true"
        aria-checked="false"
        title={fm({ id: "males" })}
        onClick={() => setGender(gender === "male" ? null : "male")}
        className={`ri-men-line ${gender === "male" ? "active" : ""}`}
      ></i>
      {/* <IoFemaleSharp
        size={28}
        title={fm({ id: "females" })}
        className={`icon ${gender === "female" ? "active" : ""}`}
        onClick={() => setGender(gender === "female" ? null : "female")}
      /> */}
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

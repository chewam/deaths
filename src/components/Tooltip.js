const Tooltip = ({ active, payload, label, renderer }) =>
  active ? (
    <div className="custom-tooltip">
      <div>{label}</div>
      <div>{renderer(payload)}</div>
    </div>
  ) : null

export default Tooltip

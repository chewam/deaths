const Tooltip = ({ active, payload, label, render }) =>
  active ? (
    <div className="custom-tooltip">
      <div>{label}</div>
      <div>{render(payload)}</div>
    </div>
  ) : null

export default Tooltip

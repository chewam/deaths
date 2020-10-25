const Tooltip = ({ active, payload, label }) =>
  active ? (
    <div className="custom-tooltip">
      <div>{label}</div>
      <div>{new Intl.NumberFormat("fr-FR").format(payload[0].value)} décès</div>
    </div>
  ) : null

export default Tooltip

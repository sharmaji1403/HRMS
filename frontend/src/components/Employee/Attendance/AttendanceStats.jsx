const AttendanceStats = ({ history }) => {
  const daysPresent = history.filter(a => a.status === "PRESENT" || a.status === "LATE").length
  const lateArrivals = history.filter(a => a.status === "LATE").length
  const avgHours = history.length > 0
    ? (history.reduce((sum, a) => sum + (a.workingHours || 0), 0) / history.length).toFixed(1)
    : "0"

  const stats = [
    { label: "Days Present", value: daysPresent },
    { label: "Late Arrivals", value: lateArrivals },
    { label: "Avg. Work Hrs", value: `${avgHours} Hrs` },
  ]

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {stats.map((s) => (
        <div key={s.label} className="card p-5 text-center">
          <p className="text-2xl font-semibold text-slate-800">{s.value}</p>
          <p className="text-xs text-slate-500 mt-1">{s.label}</p>
        </div>
      ))}
    </div>
  )
}

export default AttendanceStats
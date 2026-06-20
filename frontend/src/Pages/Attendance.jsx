import { ClockIcon } from "lucide-react"

const dummyAttendance = [
  { _id: 1, date: "Mar 15, 2026", checkIn: "04:12 PM", checkOut: "12:12 AM", hours: "8h 0m", type: "Full Day", status: "PRESENT" },
  { _id: 2, date: "Mar 13, 2026", checkIn: "07:18 PM", checkOut: "03:18 AM", hours: "8h 0m", type: "Full Day", status: "PRESENT" },
]

const Attendance = () => {
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Attendance</h1>
        <p className="page-subtitle">Track your work hours and daily check-ins</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Days Present", value: "2" },
          { label: "Late Arrivals", value: "0" },
          { label: "Avg. Work Hrs", value: "8.5 Hrs" },
        ].map((s) => (
          <div key={s.label} className="card p-5 text-center">
            <p className="text-2xl font-semibold text-slate-800">{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Clock In Card */}
      <div className="card p-5 mb-6 flex items-center justify-between">
        <div>
          <p className="font-medium text-slate-800">Clock In</p>
          <p className="text-sm text-slate-500">Start your work day</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <ClockIcon size={16} />
          Clock In
        </button>
      </div>

      {/* Recent Activity Table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-medium text-slate-800">Recent Activity</h3>
        </div>
        <table className="table-modern">
          <thead>
            <tr>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Working Hours</th>
              <th>Day Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {dummyAttendance.map((a) => (
              <tr key={a._id}>
                <td className="text-slate-600">{a.date}</td>
                <td className="text-slate-600">{a.checkIn}</td>
                <td className="text-slate-600">{a.checkOut}</td>
                <td className="text-slate-600">{a.hours}</td>
                <td className="text-slate-600">{a.type}</td>
                <td>
                  <span className="badge badge-success">{a.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Attendance
import { ClockIcon } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { dummyAttendanceData } from "../assets/assets"
import Loading from "../components/Loading"


const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const dd = String(date.getDate()).padStart(2, "0")
  const mm = months[date.getMonth()]
  const yyyy = date.getFullYear()
  return `${dd} ${mm} ${yyyy}`
}

const formatTime = (timeStr) => {
  if (!timeStr) return "-"
  const [hour, min] = timeStr.split(":").map(Number)
  const ampm = hour >= 12 ? "PM" : "AM"
  const h = hour % 12 || 12
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")} ${ampm}`
}

const Attendance = () => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setHistory(dummyAttendanceData)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) return <Loading />

  const daysPresent = history.filter(a => a.status === "PRESENT").length
  const lateArrivals = history.filter(a => a.Late === true).length
  const avgHours = history.length > 0
    ? (history.reduce((sum, a) => sum + (a.workingHours || 0), 0) / history.length).toFixed(1)
    : "0"

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
          { label: "Days Present", value: daysPresent },
          { label: "Late Arrivals", value: lateArrivals },
          { label: "Avg. Work Hrs", value: `${avgHours} Hrs` },
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
            {history.map((a) => (
              <tr key={a._id}>
                <td className="text-slate-600">{formatDate(a.date)}</td>
                <td className="text-slate-600">{formatTime(a.checkIn)}</td>
                <td className="text-slate-600">{formatTime(a.checkOut)}</td>
                <td>{a.workingHours} Hrs</td>
                <td>{a.dayType}</td>
                <td>
                  <span className={`badge ${a.status === "PRESENT" ? "badge-success" : "badge-danger"}`}>
                    {a.status}
                  </span>
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
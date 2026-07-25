import { formatDate, formatTime } from "../../../utils/dateFormat"

const AttendanceTable = ({ history }) => (
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
        {history.length === 0 ? (
          <tr>
            <td colSpan={6} className="text-center text-slate-400 py-8">No attendance records found</td>
          </tr>
        ) : (
          history.map((a) => (
            <tr key={a._id}>
              <td className="text-slate-600">{formatDate(a.date)}</td>
              <td className="text-slate-600">{formatTime(a.checkIn)}</td>
              <td className="text-slate-600">{formatTime(a.checkOut)}</td>
              <td>{a.workingHours ?? "-"} Hrs</td>
              <td>{a.dayType || "-"}</td>
              <td>
                <span className={`badge ${a.status === "PRESENT" ? "badge-success" : a.status === "LATE" ? "badge-warning" : "badge-danger"}`}>
                  {a.status}
                </span>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
)

export default AttendanceTable
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import api from "../../api/axios"

const statusStyles = {
  APPROVED: "badge-success",
  REJECTED: "badge-danger",
  PENDING: "badge-warning"
}

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
const formatDate = (d) => {
  const date = new Date(d)
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

const LeaveRow = ({ leave, onApprove, onReject, allLeaves }) => {
  const [expanded, setExpanded] = useState(false)
  const emp = leave.employee

  const empHistory = allLeaves.filter(l =>
    l.employee?._id === emp?._id && l._id !== leave._id
  )

  return (
    <>
      <tr
        className="cursor-pointer hover:bg-slate-50/50 transition-colors duration-150"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="font-medium text-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
              <span className="text-indigo-500 text-xs font-semibold">
                {emp?.firstName?.charAt(0)}{emp?.lastName?.charAt(0)}
              </span>
            </div>
            {emp?.firstName} {emp?.lastName}
          </div>
        </td>
        <td><span className="badge bg-slate-100 text-slate-600">{leave.type}</span></td>
        <td className="text-slate-500">{formatDate(leave.startDate)} – {formatDate(leave.endDate)}</td>
        <td className="text-slate-500 max-w-[160px] truncate">{leave.reason}</td>
        <td><span className={`badge ${statusStyles[leave.status]}`}>{leave.status}</span></td>
        <td>
          <div className="flex items-center gap-2">
            {leave.status === "PENDING" && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); onApprove(leave.id) }}
                  className="btn-secondary text-xs py-1 px-3"
                >
                  Approve
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onReject(leave.id) }}
                  className="text-xs py-1 px-3 rounded-md border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  Reject
                </button>
              </>
            )}
            {expanded
              ? <ChevronUpIcon size={16} className="text-slate-400 ml-1" />
              : <ChevronDownIcon size={16} className="text-slate-400 ml-1" />
            }
          </div>
        </td>
      </tr>

      {expanded && (
        <tr>
          <td colSpan={6} className="bg-slate-50/80 px-6 py-4 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              {emp?.firstName}'s Leave History
            </p>
            {empHistory.length === 0 ? (
              <p className="text-sm text-slate-400">No other leave records found</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-slate-400 uppercase">
                    <th className="text-left pb-2 font-medium">Type</th>
                    <th className="text-left pb-2 font-medium">Dates</th>
                    <th className="text-left pb-2 font-medium">Reason</th>
                    <th className="text-left pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {empHistory.map((h) => (
                    <tr key={h._id}>
                      <td className="py-2">
                        <span className="badge bg-slate-100 text-slate-600">{h.type}</span>
                      </td>
                      <td className="py-2 text-slate-500">{formatDate(h.startDate)} – {formatDate(h.endDate)}</td>
                      <td className="py-2 text-slate-500 max-w-[180px] truncate">{h.reason}</td>
                      <td className="py-2">
                        <span className={`badge ${statusStyles[h.status]}`}>{h.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </td>
        </tr>
      )}
    </>
  )
}

const AdminLeave = ({ leaves, onRefresh }) => {
  const handleApprove = async (id) => {
    try {
      await api.patch(`/leaves/${id}`, { status: "APPROVED" })
      toast.success("Leave approved")
      onRefresh()
    } catch (error) {
      toast.error(error.response?.data?.error || error.message)
    }
  }

  const handleReject = async (id) => {
    try {
      await api.patch(`/leaves/${id}`, { status: "REJECTED" })
      toast.success("Leave rejected")
      onRefresh()
    } catch (error) {
      toast.error(error.response?.data?.error || error.message)
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Leave Management</h1>
        <p className="page-subtitle">Manage leave applications</p>
      </div>

      <div className="card overflow-hidden">
        <table className="table-modern">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Type</th>
              <th>Dates</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaves.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-slate-400 py-8">No leave applications found</td>
              </tr>
            ) : (
              leaves.map((leave) => (
                <LeaveRow
                  key={leave._id}
                  leave={leave}
                  allLeaves={leaves}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminLeave
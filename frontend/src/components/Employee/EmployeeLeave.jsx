import { PlusIcon, XIcon, CalendarIcon } from "lucide-react"
import { useState } from "react"

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

// ── Apply Leave Modal ────────────────────────────────────────
const ApplyLeaveModal = ({ onClose, onApply }) => {
  const [form, setForm] = useState({
    type: "CASUAL",
    startDate: "",
    endDate: "",
    reason: ""
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = () => {
    if (!form.startDate || !form.endDate || !form.reason) return
    onApply({ ...form, _id: Date.now(), status: "PENDING" })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-800">Apply for Leave</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <XIcon size={20} />
          </button>
        </div>

        <div className="space-y-3">
          {/* Leave Type */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Leave Type</label>
            <select name="type" value={form.type} onChange={handleChange}>
              {["CASUAL", "SICK", "ANNUAL"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Start Date</label>
              <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">End Date</label>
              <input type="date" name="endDate" value={form.endDate} onChange={handleChange} />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Reason</label>
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              rows={3}
              placeholder="Write your reason..."
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 btn-secondary">Cancel</button>
          <button onClick={handleSubmit} className="flex-1 btn-primary">Submit</button>
        </div>
      </div>
    </div>
  )
}

// ── Employee Leave Page ──────────────────────────────────────
const EmployeeLeave = ({ leaves, showModal, setShowModal }) => {
  const [localLeaves, setLocalLeaves] = useState(leaves)

  const sickCount = localLeaves.filter(l => l.type === "SICK" && l.status === "APPROVED").length
  const casualCount = localLeaves.filter(l => l.type === "CASUAL" && l.status === "APPROVED").length
  const annualCount = localLeaves.filter(l => l.type === "ANNUAL" && l.status === "APPROVED").length

  const handleApply = (newLeave) => {
    setLocalLeaves(prev => [newLeave, ...prev])
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Leave Management</h1>
          <p className="page-subtitle">Your leave history and requests</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2 w-fit"
        >
          <PlusIcon size={16} /> Apply for Leave
        </button>
      </div>

      {/* Leave Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Sick Leave", value: sickCount, color: "text-rose-600", bg: "bg-rose-50" },
          { label: "Casual Leave", value: casualCount, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Annual Leave", value: annualCount, color: "text-indigo-600", bg: "bg-indigo-50" },
        ].map((s) => (
          <div key={s.label} className={`card p-5 text-center`}>
            <p className={`text-2xl font-semibold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            <p className="text-xs text-slate-400">taken</p>
          </div>
        ))}
      </div>

      {/* Leave History Table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-medium text-slate-800">Leave History</h3>
        </div>
        <table className="table-modern">
          <thead>
            <tr>
              <th>Type</th>
              <th>Dates</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {localLeaves.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-slate-400 py-8">No leave records found</td>
              </tr>
            ) : (
              localLeaves.map((leave) => (
                <tr key={leave._id}>
                  <td><span className="badge bg-slate-100 text-slate-600">{leave.type}</span></td>
                  <td className="text-slate-500">{formatDate(leave.startDate)} – {formatDate(leave.endDate)}</td>
                  <td className="text-slate-500 max-w-[200px] truncate">{leave.reason}</td>
                  <td><span className={`badge ${statusStyles[leave.status]}`}>{leave.status}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Apply Leave Modal */}
      {showModal && (
        <ApplyLeaveModal
          onClose={() => setShowModal(false)}
          onApply={handleApply}
        />
      )}
    </div>
  )
}

export default EmployeeLeave
const statusStyles = {
  APPROVED: "badge-success",
  REJECTED: "badge-danger",
  PENDING: "badge-warning",
}

const dummyLeaves = [
  { _id: 1, employee: "David Michael", type: "ANNUAL", from: "Mar 27", to: "Mar 29, 2026", reason: "Out for a trip", status: "APPROVED" },
  { _id: 2, employee: "Alex Matthew", type: "CASUAL", from: "Mar 23", to: "Mar 24, 2026", reason: "Going For Vacations", status: "REJECTED" },
  { _id: 3, employee: "John Doe", type: "CASUAL", from: "Mar 27", to: "Mar 28, 2026", reason: "Going to visit a temple", status: "PENDING" },
  { _id: 4, employee: "David Michael", type: "SICK", from: "Mar 15", to: "Mar 16, 2026", reason: "I had a fracture on leg", status: "APPROVED" },
]

const Leave = () => {
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Leave Management</h1>
        <p className="page-subtitle">Manage leave applications</p>
      </div>

      {/* Table */}
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
            {dummyLeaves.map((leave) => (
              <tr key={leave._id}>
                <td className="font-medium text-slate-800">{leave.employee}</td>
                <td>
                  <span className="badge bg-slate-100 text-slate-600">{leave.type}</span>
                </td>
                <td className="text-slate-500">{leave.from} – {leave.to}</td>
                <td className="text-slate-500 max-w-[200px] truncate">{leave.reason}</td>
                <td>
                  <span className={`badge ${statusStyles[leave.status]}`}>{leave.status}</span>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <button className="btn-secondary text-xs py-1 px-3">Approve</button>
                    <button className="text-xs py-1 px-3 rounded-md border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors">Reject</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Leave
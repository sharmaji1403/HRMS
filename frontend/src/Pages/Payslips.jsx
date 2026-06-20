import { DownloadIcon, PlusIcon } from "lucide-react"

const dummyPayslips = [
  { _id: 1, employee: "David Michael", period: "February 2026", basic: "$2,000", net: "$2,180" },
  { _id: 2, employee: "Alex Matthew", period: "February 2026", basic: "$2,000", net: "$2,180" },
  { _id: 3, employee: "John Doe", period: "February 2026", basic: "$1,000", net: "$1,090" },
  { _id: 4, employee: "David Michael", period: "January 2026", basic: "$1,000", net: "$1,180" },
  { _id: 5, employee: "Alex Matthew", period: "January 2026", basic: "$2,000", net: "$2,090" },
  { _id: 6, employee: "John Doe", period: "January 2026", basic: "$2,000", net: "$2,090" },
]

const Payslips = () => {
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Payslips</h1>
          <p className="page-subtitle">Generate and manage employee payslips</p>
        </div>
        <button className="btn-primary flex items-center gap-2 w-fit">
          <PlusIcon size={16} />
          Generate Payslip
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="table-modern">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Period</th>
              <th>Basic Salary</th>
              <th>Net Salary</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dummyPayslips.map((slip) => (
              <tr key={slip._id}>
                <td className="font-medium text-slate-800">{slip.employee}</td>
                <td className="text-slate-500">{slip.period}</td>
                <td className="text-slate-700">{slip.basic}</td>
                <td className="font-medium text-slate-800">{slip.net}</td>
                <td>
                  <button className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors">
                    <DownloadIcon size={14} />
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Payslips
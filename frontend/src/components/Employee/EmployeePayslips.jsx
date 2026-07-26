import { PrinterIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

const EmployeePayslips = ({ payslips }) => {
  const navigate = useNavigate()

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Payslips</h1>
        <p className="page-subtitle">Your payslip history</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-modern min-w-[700px]">
            <thead>
              <tr>
                <th>Period</th>
                <th>Basic Salary</th>
                <th>Allowances</th>
                <th>Deductions</th>
                <th>Net Salary</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {payslips.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-slate-400 py-8">No payslips found</td>
                </tr>
              ) : (
                payslips.map((slip) => (
                  <tr key={slip.id}>
                    <td className="text-indigo-500">{months[slip.month - 1]} {slip.year}</td>
                    <td className="text-slate-600">${slip.basicSalary?.toLocaleString()}</td>
                    <td className="text-emerald-600">+${slip.allowances?.toLocaleString()}</td>
                    <td className="text-rose-500">-${slip.deductions?.toLocaleString()}</td>
                    <td className="font-semibold text-slate-800">${slip.netSalary?.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${slip.status === "PAID" ? "badge-success" : "badge-warning"}`}>{slip.status}</span>
                    </td>
                    <td>
                      <button
                        onClick={() => navigate(`/print/payslip/${slip.id}`, { state: { slip } })}
                        className="inline-flex items-center gap-1.5 text-indigo-600 border border-indigo-200 hover:bg-indigo-50 px-3 py-1.5 rounded-lg text-sm transition-colors"
                      >
                        <PrinterIcon size={14} />
                        Print
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default EmployeePayslips
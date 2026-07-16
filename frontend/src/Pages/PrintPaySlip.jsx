import { useLocation, useNavigate } from "react-router-dom"
import { PrinterIcon, ArrowLeftIcon } from "lucide-react"

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]

const PrintPaySlip = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const slip = state?.slip

  console.log("STATE:", state) 
console.log("SLIP:", slip)

  if (!slip) return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <p className="text-slate-500">No payslip data found</p>
      <button onClick={() => navigate("/payslips")} className="btn-primary">Go Back</button>
    </div>
  )

  const emp = Array.isArray(slip.employee) ? slip.employee[0] : slip.employee

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      {/* Action Buttons - Print mein nahi dikhenge */}
      <div className="max-w-2xl mx-auto mb-4 flex gap-3 print:hidden">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 btn-secondary"
        >
          <ArrowLeftIcon size={16} />
          Back
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 btn-primary"
        >
          <PrinterIcon size={16} />
          Print
        </button>
      </div>

      {/* Payslip Card */}
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8 print:shadow-none print:rounded-none">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Employee MS</h1>
            <p className="text-slate-500 text-sm">Management System</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-indigo-600">Payslip</p>
            <p className="text-slate-500 text-sm">{months[slip.month - 1]} {slip.year}</p>
          </div>
        </div>

        {/* Employee Info */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Employee Name</p>
            <p className="font-semibold text-slate-800">{emp?.firstName} {emp?.lastName}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Position</p>
            <p className="font-semibold text-slate-800">{emp?.position || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Department</p>
            <p className="font-semibold text-slate-800">{emp?.department || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Email</p>
            <p className="font-semibold text-slate-800">{emp?.email || "N/A"}</p>
          </div>
        </div>

        {/* Salary Breakdown */}
        <div className="bg-slate-50 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-slate-700 mb-4">Salary Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-slate-600">Basic Salary</p>
              <p className="font-medium text-slate-800">${slip.basicSalary?.toLocaleString()}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-slate-600">Allowances</p>
              <p className="font-medium text-emerald-600">+${slip.allowances?.toLocaleString()}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-slate-600">Deductions</p>
              <p className="font-medium text-rose-500">-${slip.deductions?.toLocaleString()}</p>
            </div>
            <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
              <p className="font-semibold text-slate-800">Net Salary</p>
              <p className="text-xl font-bold text-indigo-600">${slip.netSalary?.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-400 border-t border-slate-100 pt-4">
          <p>This is a system generated payslip — {months[slip.month - 1]} {slip.year}</p>
          <p className="mt-1">© 2026 Employee MS. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default PrintPaySlip
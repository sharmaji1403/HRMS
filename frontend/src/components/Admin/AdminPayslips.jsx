import { DownloadIcon, PlusIcon, XIcon } from "lucide-react"
import { useState } from "react"
import { dummyEmployeeData } from "../../assets/assets"

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]

// ── Generate Payslip Modal ───────────────────────────────────
const GeneratePayslipModal = ({ onClose, onGenerate }) => {
  const [form, setForm] = useState({
    employeeId: dummyEmployeeData[0]._id,
    month: "1",
    year: new Date().getFullYear().toString(),
    basicSalary: "",
    allowances: "",
    deductions: "",
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const netSalary = (Number(form.basicSalary) + Number(form.allowances) - Number(form.deductions)) || 0

  const handleSubmit = () => {
    if (!form.basicSalary) return
    const emp = dummyEmployeeData.find(e => e._id === form.employeeId)
    onGenerate({
      _id: Date.now(),
      employee: emp,
      month: Number(form.month),
      year: Number(form.year),
      basicSalary: Number(form.basicSalary),
      allowances: Number(form.allowances),
      deductions: Number(form.deductions),
      netSalary,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-800">Generate Payslip</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <XIcon size={20} />
          </button>
        </div>

        <div className="space-y-3">
          {/* Employee */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Employee</label>
            <select name="employeeId" value={form.employeeId} onChange={handleChange}>
              {dummyEmployeeData.map(emp => (
                <option key={emp._id} value={emp._id}>
                  {emp.firstName} {emp.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Month + Year */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Month</label>
              <select name="month" value={form.month} onChange={handleChange}>
                {months.map((m, i) => (
                  <option key={m} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Year</label>
              <input type="number" name="year" value={form.year} onChange={handleChange} placeholder="2026" />
            </div>
          </div>

          {/* Salary Fields */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Basic Salary ($)</label>
            <input type="number" name="basicSalary" value={form.basicSalary} onChange={handleChange} placeholder="2000" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Allowances ($)</label>
              <input type="number" name="allowances" value={form.allowances} onChange={handleChange} placeholder="200" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Deductions ($)</label>
              <input type="number" name="deductions" value={form.deductions} onChange={handleChange} placeholder="20" />
            </div>
          </div>

          {/* Net Salary Preview */}
          <div className="bg-indigo-50 rounded-lg px-4 py-3 flex items-center justify-between">
            <p className="text-sm text-slate-600">Net Salary</p>
            <p className="text-lg font-semibold text-indigo-600">${netSalary.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 btn-secondary">Cancel</button>
          <button onClick={handleSubmit} className="flex-1 btn-primary">Generate</button>
        </div>
      </div>
    </div>
  )
}

// ── Admin Payslips Page ──────────────────────────────────────
const AdminPayslips = ({ payslips }) => {
  const [payslipList, setPayslipList] = useState(payslips)
  const [showModal, setShowModal] = useState(false)

  const handleGenerate = (newPayslip) => {
    setPayslipList(prev => [newPayslip, ...prev])
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Payslips</h1>
          <p className="text-slate-500 mt-1">Generate and manage employee payslips</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <PlusIcon size={16} />
          Generate Payslip
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Employee</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Period</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Basic Salary</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Net Salary</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payslipList.map((slip) => {
              const emp = Array.isArray(slip.employee) ? slip.employee[0] : slip.employee
              return (
                <tr key={slip._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{emp?.firstName} {emp?.lastName}</td>
                  <td className="px-6 py-4 text-indigo-500">{months[slip.month - 1]} {slip.year}</td>
                  <td className="px-6 py-4 text-slate-600">${slip.basicSalary?.toLocaleString()}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800">${slip.netSalary?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <button className="inline-flex items-center gap-1.5 text-sm text-indigo-600 border border-indigo-200 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                      <DownloadIcon size={14} />
                      Download
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Generate Modal */}
      {showModal && (
        <GeneratePayslipModal
          onClose={() => setShowModal(false)}
          onGenerate={handleGenerate}
        />
      )}
    </div>
  )
}

export default AdminPayslips
import { PlusIcon, PrinterIcon, XIcon } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import api from "../../api/axios"

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]

// ── Generate Payslip Modal ───────────────────────────────────
const GeneratePayslipModal = ({ employees, onClose, onGenerate }) => {
  const [form, setForm] = useState({
    employeeId: employees[0]?.id || "",
    month: String(new Date().getMonth() + 1),
    year: new Date().getFullYear().toString(),
    basicSalary: "",
    allowances: "",
    deductions: "",
  })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const netSalary = (Number(form.basicSalary) + Number(form.allowances) - Number(form.deductions)) || 0

  const handleSubmit = async () => {
    if (!form.employeeId || !form.basicSalary) return
    setSubmitting(true)
    await onGenerate(form)
    setSubmitting(false)
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
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Employee</label>
            <select name="employeeId" value={form.employeeId} onChange={handleChange}>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName}
                </option>
              ))}
            </select>
          </div>

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

          <div className="bg-indigo-50 rounded-lg px-4 py-3 flex items-center justify-between">
            <p className="text-sm text-slate-600">Net Salary</p>
            <p className="text-lg font-semibold text-indigo-600">${netSalary.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 btn-secondary">Cancel</button>
          <button onClick={handleSubmit} disabled={submitting} className="flex-1 btn-primary disabled:opacity-50">
            {submitting ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Admin Payslips Page ──────────────────────────────────────
const AdminPayslips = ({ payslips, onRefresh }) => {
  const [showModal, setShowModal] = useState(false)
  const [employees, setEmployees] = useState([])
  const navigate = useNavigate()

  const fetchEmployees = useCallback(async () => {
    try {
      const res = await api.get("/employees")
      setEmployees(res.data)
    } catch (error) {
      toast.error(error.response?.data?.error || error.message)
    }
  }, [])

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  const handleGenerate = async (form) => {
    try {
      await api.post("/payslips", form)
      toast.success("Payslip generated successfully!")
      setShowModal(false)
      onRefresh()
    } catch (error) {
      toast.error(error.response?.data?.error || error.message)
    }
  }

  return (
    <div className="animate-fade-in">
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

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Employee</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Period</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Basic Salary</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Net Salary</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Status</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payslips.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-slate-400 py-8">No payslips found</td>
              </tr>
            ) : (
              payslips.map((slip) => {
                const emp = slip.employee
                return (
                  <tr key={slip.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{emp?.firstName} {emp?.lastName}</td>
                    <td className="px-6 py-4 text-indigo-500">{months[slip.month - 1]} {slip.year}</td>
                    <td className="px-6 py-4 text-slate-600">${slip.basicSalary?.toLocaleString()}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">${slip.netSalary?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${slip.status === "PAID" ? "badge-success" : "badge-warning"}`}>{slip.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate(`/print/payslip/${slip.id}`, { state: { slip } })}
                        className="inline-flex items-center gap-1.5 text-sm text-indigo-600 border border-indigo-200 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <PrinterIcon size={14} />
                        Print
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <GeneratePayslipModal
          employees={employees}
          onClose={() => setShowModal(false)}
          onGenerate={handleGenerate}
        />
      )}
    </div>
  )
}

export default AdminPayslips
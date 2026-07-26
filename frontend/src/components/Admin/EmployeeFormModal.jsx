import { XIcon } from "lucide-react"
import { useState } from "react"

const departments = ["Engineering", "IT Support", "Marketing"]
const roles = ["EMPLOYEE", "ADMIN"]

const EmployeeFormModal = ({ mode = "add", employee, onClose, onSubmit }) => {
  const isEdit = mode === "edit"

  const [form, setForm] = useState({
    firstName: employee?.firstName || "",
    lastName: employee?.lastName || "",
    email: employee?.email || "",
    phone: employee?.phone || "",
    position: employee?.position || "",
    department: employee?.department || "Engineering",
    role: employee?.user?.role || "EMPLOYEE",
    joinDate: employee?.joinDate ? employee.joinDate.slice(0, 10) : "",
    password: "",
  })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.position || !form.joinDate) {
      return
    }
    if (!isEdit && !form.password) {
      return
    }
    setSubmitting(true)
    await onSubmit(form)
    setSubmitting(false)
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-800">{isEdit ? "Edit Employee" : "Add Employee"}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <XIcon size={20} />
          </button>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">First Name</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="John" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Last Name</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Doe" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Work Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@company.com" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Phone Number</label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Join Date</label>
            <input type="date" name="joinDate" value={form.joinDate} onChange={handleChange} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Position</label>
          <input name="position" value={form.position} onChange={handleChange} placeholder="Software Developer" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Department</label>
            <select name="department" value={form.department} onChange={handleChange}>
              {departments.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Role</label>
            <select name="role" value={form.role} onChange={handleChange}>
              {roles.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
        </div>

        {!isEdit && (
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Temporary Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" />
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={onClose} className="flex-1 btn-secondary">Cancel</button>
        <button onClick={handleSubmit} disabled={submitting} className="flex-1 btn-primary disabled:opacity-50">
          {submitting ? "Saving..." : isEdit ? "Save Changes" : "Add Employee"}
        </button>
      </div>
    </div>

  )
}

export default EmployeeFormModal
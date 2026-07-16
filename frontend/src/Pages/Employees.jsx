import { PlusIcon, SearchIcon, MoreVerticalIcon, PencilIcon, Trash2Icon, XIcon } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { dummyEmployeeData } from "../assets/assets"

const departments = ["All Departments", "Engineering", "IT Support", "Marketing"]

// ── Add Employee Modal ───────────────────────────────────────
const AddEmployeeModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({
    firstName: "", lastName: "", jobTitle: "", department: "Engineering", email: ""
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = () => {
    if (!form.firstName || !form.lastName) return
    onAdd({ ...form, _id: Date.now() })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-800">Add Employee</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <XIcon size={20} />
          </button>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">First Name</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="John" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Last Name</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Doe" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Job Title</label>
            <input name="jobTitle" value={form.jobTitle} onChange={handleChange} placeholder="Software Developer" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
            <input name="email" value={form.email} onChange={handleChange} placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Department</label>
            <select name="department" value={form.department} onChange={handleChange}>
              {["Engineering", "IT Support", "Marketing"].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 btn-secondary">Cancel</button>
          <button onClick={handleSubmit} className="flex-1 btn-primary">Add Employee</button>
        </div>
      </div>
    </div>
  )
}

// ── Delete Confirmation Modal ────────────────────────────────
const DeleteModal = ({ employee, onClose, onConfirm }) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800">Delete Employee</h2>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
          <XIcon size={20} />
        </button>
      </div>
      <p className="text-slate-500 text-sm mb-6">
        Are you sure you want to delete <span className="font-semibold text-slate-700">{employee.firstName} {employee.lastName}</span>? This action cannot be undone.
      </p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 btn-secondary">Cancel</button>
        <button onClick={onConfirm} className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-md transition-colors">
          Delete
        </button>
      </div>
    </div>
  </div>
)

// ── Edit Employee Modal ──────────────────────────────────────
const EditEmployeeModal = ({ employee, onClose, onSave }) => {
  const [form, setForm] = useState({
    firstName: employee.firstName,
    lastName: employee.lastName,
    jobTitle: employee.jobTitle,
    department: employee.department,
    email: employee.email || ""
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = () => {
    if (!form.firstName || !form.lastName) return
    onSave({ ...employee, ...form })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-800">Edit Employee</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <XIcon size={20} />
          </button>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">First Name</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="John" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Last Name</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Doe" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Job Title</label>
            <input name="jobTitle" value={form.jobTitle} onChange={handleChange} placeholder="Software Developer" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
            <input name="email" value={form.email} onChange={handleChange} placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Department</label>
            <select name="department" value={form.department} onChange={handleChange}>
              {["Engineering", "IT Support", "Marketing"].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 btn-secondary">Cancel</button>
          <button onClick={handleSubmit} className="flex-1 btn-primary">Save Changes</button>
        </div>
      </div>
    </div>
  )
}

// ── Employee Card ────────────────────────────────────────────
const EmployeeCard = ({ emp, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative bg-slate-50 pt-4 px-4 pb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="inline-block text-xs text-slate-600 border border-slate-200 bg-white px-2.5 py-1 rounded-full">
            {emp.department}
          </span>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors text-slate-400 hover:text-slate-600"
            >
              <MoreVerticalIcon size={16} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-8 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-[130px] py-1 animate-fade-in">
                <button
                  onClick={() => { onEdit(emp); setMenuOpen(false) }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <PencilIcon size={14} className="text-slate-400" />
                  Edit
                </button>
                <button
                  onClick={() => { onDelete(emp); setMenuOpen(false) }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <Trash2Icon size={14} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-400 text-2xl font-semibold">
              {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
            </span>
          </div>
        </div>
      </div>
      <div className="px-4 py-4">
        <p className="font-semibold text-slate-800">{emp.firstName} {emp.lastName}</p>
        <p className="text-sm text-slate-500 mt-0.5">{emp.jobTitle}</p>
      </div>
    </div>
  )
}

// ── Main Employees Page ──────────────────────────────────────
const Employees = () => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedDept, setSelectedDept] = useState("All Departments")
  const [showAddModal, setShowAddModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [editTarget, setEditTarget] = useState(null)

  const fetchEmployees = useCallback(async () => {
    setLoading(true)
    setEmployees(dummyEmployeeData)
    setTimeout(() => setLoading(false), 1000)
  }, [])

  useEffect(() => {
    fetchEmployees()
  }, [])

  const filtered = employees
    .filter(emp =>
      `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(search.toLowerCase())
    )
    .filter(emp => selectedDept === "All Departments" || emp.department === selectedDept)

  const handleAdd = (newEmp) => {
    setEmployees(prev => [...prev, newEmp])
  }

  const handleDelete = () => {
    setEmployees(prev => prev.filter(e => e._id !== deleteTarget._id))
    setDeleteTarget(null)
  }

  const handleEdit = (updatedEmp) => {
    setEmployees(prev => prev.map(e => e._id === updatedEmp._id ? updatedEmp : e))
    setEditTarget(null)
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Employees</h1>
          <p className="text-slate-500 mt-1">Manage your team members</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <PlusIcon size={16} />
          Add Employee
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 mb-6">
        <div className="relative" style={{ flex: 1 }}>
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          style={{ width: "180px" }}
        >
          {departments.map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      {/* Employee Cards */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <SearchIcon className="w-7 h-7 text-slate-400" />
          </div>
          <p className="text-slate-700 font-medium text-lg">Employee not found</p>
          <p className="text-slate-400 text-sm mt-1">Try searching with a different name or department</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((emp) => (
            <EmployeeCard
              key={emp._id}
              emp={emp}
              onEdit={setEditTarget}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <AddEmployeeModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAdd}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          employee={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
      {editTarget && (
        <EditEmployeeModal
          employee={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={handleEdit}
        />
      )}
    </div>
  )
}

export default Employees
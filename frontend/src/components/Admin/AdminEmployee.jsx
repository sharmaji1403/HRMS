import { PlusIcon, SearchIcon } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast"
import api from "../../api/axios"

import EmployeeCard from "./EmployeeCard"
import EmployeeFormModal from "./EmployeeFormModal"
import DeleteModal from "./DeleteModal"

const departments = ["All Departments", "Engineering", "IT Support", "Marketing"]

const AdminEmployee = () => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedDept, setSelectedDept] = useState("All Departments")
  const [showAddModal, setShowAddModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [editTarget, setEditTarget] = useState(null)

  // ── Fetch employees from backend ─────────────────────────
  const fetchEmployees = useCallback(async () => {
  try {
    setLoading(true)
    const url = selectedDept && selectedDept !== "All Departments"
      ? `/employees?department=${selectedDept}`
      : "/employees"
    const res = await api.get(url)
    setEmployees(res.data)
  } catch (err) {
    toast.error(err.response?.data?.error || err.message)
  } finally {
    setLoading(false)
  }
}, [selectedDept])

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  const filtered = employees
    .filter(emp =>
      `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(search.toLowerCase())
    )
    .filter(emp => selectedDept === "All Departments" || emp.department === selectedDept)

  // ── Create Employee ───────────────────────────────────────
  const handleAdd = async (formData) => {
    try {
      await api.post("/employees", { ...formData, phone: Number(formData.phone) })
      toast.success("Employee added successfully!")
      setShowAddModal(false)
      fetchEmployees()
    } catch (err) {
      toast.error(err.response?.data?.error || err.message)
    }
  }

  // ── Update Employee ───────────────────────────────────────
  const handleEditSave = async (formData) => {
    try {
      await api.put(`/employees/${editTarget.id}`, { ...formData, phone: Number(formData.phone) })
      toast.success("Employee updated successfully!")
      setEditTarget(null)
      fetchEmployees()
    } catch (err) {
      toast.error(err.response?.data?.error || err.message)
    }
  }

  // ── Delete Employee ───────────────────────────────────────
  const handleDelete = async () => {
    try {
      await api.delete(`/employees/${deleteTarget.id}`)
      toast.success("Employee deleted")
      fetchEmployees()
    } catch (err) {
      toast.error(err.response?.data?.error || err.message)
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Header — ✅ mobile pe stack, desktop pe side-by-side */}
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
  <div>
    <h1 className="text-2xl font-semibold text-slate-800">Employees</h1>
    <p className="text-slate-500 mt-1">Manage your team members</p>
  </div>
  <button
    onClick={() => setShowAddModal(true)}
    className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors w-full sm:w-auto"
  >
    <PlusIcon size={16} />
    Add Employee
  </button>
</div>

{/* Search + Filter — ✅ mobile pe stack */}
<div className="flex flex-col sm:flex-row gap-3 mb-6">
  <div className="relative flex-1">
    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
    <input
      type="text"
      placeholder="Search employees..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="pl-9 w-full"
    />
  </div>
  <select
    value={selectedDept}
    onChange={(e) => setSelectedDept(e.target.value)}
    className="w-full sm:w-[180px]"
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
              key={emp.id}
              emp={emp}
              onEdit={setEditTarget}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <EmployeeFormModal
          mode="add"
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAdd}
        />
      )}

      {/* Edit Modal */}
      {editTarget && (
        <EmployeeFormModal
          mode="edit"
          employee={editTarget}
          onClose={() => setEditTarget(null)}
          onSubmit={handleEditSave}
        />
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteModal
          employee={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}

export default AdminEmployee
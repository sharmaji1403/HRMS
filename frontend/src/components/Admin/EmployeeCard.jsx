import { MoreVerticalIcon, PencilIcon, Trash2Icon } from "lucide-react"
import { useEffect, useRef, useState } from "react"

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

export default EmployeeCard
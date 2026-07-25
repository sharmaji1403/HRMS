import { XIcon } from "lucide-react"

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

export default DeleteModal
import { LockIcon } from "lucide-react"
import { useState } from "react"
import ChangePasswordModal from "../ChangePasswordModal"

const AdminSettings = () => {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account and preferences</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 max-w-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-slate-100 p-2.5 rounded-lg">
              <LockIcon className="w-5 h-5 text-slate-500" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-medium text-slate-800">Password</p>
              <p className="text-sm text-slate-500">Update your account password</p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="text-sm text-slate-700 border border-slate-300 hover:bg-slate-50 px-4 py-2 rounded-lg transition-colors"
          >
            Change
          </button>
        </div>
      </div>

      {showModal && <ChangePasswordModal onClose={() => setShowModal(false)} />}
    </div>
  )
}

export default AdminSettings
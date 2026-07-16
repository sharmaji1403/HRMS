import { LockIcon, XIcon } from "lucide-react"
import { useState } from "react"

// ── Change Password Modal ────────────────────────────────────
const ChangePasswordModal = ({ onClose }) => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError("All fields are required")
      return
    }
    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-800">Change Password</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <XIcon size={20} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Current Password</label>
            <input type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">New Password</label>
            <input type="password" name="newPassword" value={form.newPassword} onChange={handleChange} placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Confirm Password</label>
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" />
          </div>
          {error && <p className="text-xs text-rose-500">{error}</p>}
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 btn-secondary">Cancel</button>
          <button onClick={handleSubmit} className="flex-1 btn-primary">Update Password</button>
        </div>
      </div>
    </div>
  )
}

// ── Admin Settings Page ──────────────────────────────────────
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
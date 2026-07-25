import { XIcon } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import api from "../api/axios"

const ChangePasswordModal = ({ onClose }) => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError("")
  }

  const handleSubmit = async () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError("All fields are required")
      return
    }
    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    setSubmitting(true)
    try {
      await api.post("/auth/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      })
      toast.success("Password updated successfully!")
      onClose()
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    } finally {
      setSubmitting(false)
    }
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
          <button onClick={handleSubmit} disabled={submitting} className="flex-1 btn-primary disabled:opacity-50">
            {submitting ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChangePasswordModal
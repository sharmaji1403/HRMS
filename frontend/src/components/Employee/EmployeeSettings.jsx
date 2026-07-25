import { LockIcon, UserIcon } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast"
import api from "../../api/axios"
import ChangePasswordModal from "../ChangePasswordModal"
import Loading from "../Loading"

const EmployeeSettings = () => {
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", position: "", bio: "",
  })

  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get("/profile")
      setForm({
        firstName: res.data.firstName || "",
        lastName: res.data.lastName || "",
        email: res.data.email || "",
        position: res.data.position || "",
        bio: res.data.bio || "",
      })
    } catch (error) {
      toast.error(error.response?.data?.error || error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.post("/profile", {
        firstName: form.firstName,
        lastName: form.lastName,
        position: form.position,
        bio: form.bio,
      })
      toast.success("Profile updated successfully!")
    } catch (error) {
      toast.error(error.response?.data?.error || error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account and preferences</p>
      </div>

      {/* Public Profile */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-2xl mb-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-slate-100 p-2.5 rounded-lg">
            <UserIcon className="w-5 h-5 text-slate-600" />
          </div>
          <h2 className="font-medium text-slate-800">Public Profile</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
            <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="John" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
            <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Doe" />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
          <input name="email" value={form.email} disabled className="opacity-60 cursor-not-allowed" />
          <p className="text-xs text-slate-400 mt-1">Email cannot be changed here. Contact admin.</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Position</label>
          <input name="position" value={form.position} onChange={handleChange} placeholder="Software Engineer" />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
          <textarea name="bio" value={form.bio} onChange={handleChange} rows={3} placeholder="Write a brief bio..." />
          <p className="text-xs text-slate-400 mt-1">This will be displayed on your profile.</p>
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Password */}
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

export default EmployeeSettings
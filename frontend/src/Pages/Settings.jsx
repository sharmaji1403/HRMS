import { KeyRoundIcon } from "lucide-react"

const Settings = () => {
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account and preferences</p>
      </div>

      {/* Password Section */}
      <div className="card p-6 max-w-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-slate-100 p-2.5 rounded-lg">
              <KeyRoundIcon className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="font-medium text-slate-800">Password</p>
              <p className="text-sm text-slate-500">Update your account password</p>
            </div>
          </div>
          <button className="btn-secondary text-sm">Change</button>
        </div>
      </div>
    </div>
  )
}

export default Settings
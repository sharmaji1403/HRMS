import { UsersIcon, BuildingIcon, CalendarIcon, FileTextIcon } from "lucide-react"

const AdminDashboard = ({ data }) => {
  const stats = [
    { label: "Total Employees", value: data.totalEmployees ?? 3, icon: UsersIcon },
    { label: "Departments", value: data.totalDepartments ?? 10, icon: BuildingIcon },
    { label: "Today's Attendance", value: data.todayAttendance ?? 1, icon: CalendarIcon },
    { label: "Pending Leaves", value: data.pendingLeaves ?? 1, icon: FileTextIcon },
  ]

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back, Admin — here's your overview</p>
      </div>

      {/* Stats Row */}
      <div className="flex gap-0 border border-slate-200 rounded-xl overflow-hidden bg-white mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className={`flex-1 flex items-center justify-between p-6 ${index !== stats.length - 1 ? "border-r border-slate-200" : ""}`}>
              <div>
                <p className="text-sm text-slate-500 mb-2">{stat.label}</p>
                <p className="text-3xl font-semibold text-slate-800">{stat.value}</p>
              </div>
              <Icon className="w-8 h-8 text-slate-300" strokeWidth={1.2} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AdminDashboard
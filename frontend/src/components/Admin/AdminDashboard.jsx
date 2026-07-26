import { UsersIcon, BuildingIcon, CalendarIcon, FileTextIcon } from "lucide-react"

const AdminDashboard = ({ data }) => {
  const stats = [
    { label: "Total Employees", value: data.totalEmployees ?? 0, icon: UsersIcon },
    { label: "Departments", value: data.totalDepartments ?? 0, icon: BuildingIcon },
    { label: "Today's Attendance", value: data.todayAttendance ?? 0, icon: CalendarIcon },
    { label: "Pending Leaves", value: data.pendingLeaves ?? 0, icon: FileTextIcon },
  ]

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back, Admin — here's your overview</p>
      </div>

      {/* ✅ Mobile pe 2 columns, tablet+ pe 4 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs sm:text-sm text-slate-500">{stat.label}</p>
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300 shrink-0" strokeWidth={1.2} />
              </div>
              <p className="text-2xl sm:text-3xl font-semibold text-slate-800">{stat.value}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AdminDashboard
import { UsersIcon, BuildingIcon, CalendarCheckIcon, ClockIcon } from "lucide-react"
import { dummyProfileData } from "../assets/assets"

const Dashboard = () => {

  const stats = [
    { label: "Total Employees", value: "3", icon: UsersIcon, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Departments", value: "10", icon: BuildingIcon, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Today's Attendance", value: "1", icon: CalendarCheckIcon, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Pending Leaves", value: "1", icon: ClockIcon, color: "text-rose-600", bg: "bg-rose-50" },
  ]

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome back, Admin — here's your overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="card card-hover p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-slate-500">{stat.label}</p>
                <div className={`${stat.bg} p-2 rounded-lg`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              <p className="text-3xl font-semibold text-slate-800">{stat.value}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Dashboard
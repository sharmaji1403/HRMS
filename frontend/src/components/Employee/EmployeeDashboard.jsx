import { Calendar1Icon, DollarSignIcon, FileTextIcon, CalendarCheckIcon } from 'lucide-react'
import { Link } from 'react-router-dom'


const EmployeeDashboard = ({ data }) => {
  const emp = data.employee

  const cards = [
    { icon: Calendar1Icon, value: data.currentMonthAttendance ?? 0, title: "Days Present", subtitle: "This month", color: "text-indigo-600", bg: "bg-indigo-50" },
    { icon: FileTextIcon, value: data.pendingLeaves ?? 0, title: "Pending Leaves", subtitle: "Awaiting approval", color: "text-amber-600", bg: "bg-amber-50" },
    { icon: DollarSignIcon, value: data.latestPayslip ? `$${data.latestPayslip.netSalary?.toLocaleString()}` : "N/A", title: "Latest Payslip", subtitle: "Most recent payout", color: "text-emerald-600", bg: "bg-emerald-50" },
  ]

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Welcome, {emp?.firstName}!</h1>
        <p className="page-subtitle">{emp?.position} — {emp?.department || "No Department"}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.title} className="card card-hover p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-slate-500">{card.title}</p>
                <div className={`${card.bg} p-2 rounded-lg`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>
              <p className="text-3xl font-semibold text-slate-800">{card.value}</p>
              <p className="text-xs text-slate-400 mt-1">{card.subtitle}</p>
            </div>
          )
        })}
      </div>
      <div className="flex flex-wrap gap-3">
        <Link to="/attendance" className="btn-primary flex items-center gap-2 inline-flex items-center justify-center ">
          <CalendarCheckIcon size={16} /> Mark Attendance
        </Link>
        <Link to="/leave" className="btn-secondary flex items-center gap-2">
          <FileTextIcon size={16} /> Apply for Leave
        </Link>
      </div>
    </div>
  )
}

export default EmployeeDashboard
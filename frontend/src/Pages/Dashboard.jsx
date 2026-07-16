import { useState, useEffect } from "react"
import { dummyAdminDashboardData, dummyEmployeeDashboardData } from "../assets/assets"
import Loading from "../components/Loading"
import AdminDashboard from "../components/Admin/AdminDashboard"
import EmployeeDashboard from "../components/Employee/EmployeeDashboard"

const Dashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setData(dummyEmployeeDashboardData) // ADMIN test: dummyAdminDashboardData
    setTimeout(() => setLoading(false), 1000)
  }, [])

  if (loading) return <Loading />
  if (!data) return <p className="text-center text-slate-500 py-12">Failed to load dashboard</p>

  if (data.role === "ADMIN") return <AdminDashboard data={data} />
  return <EmployeeDashboard data={data} />
}

export default Dashboard
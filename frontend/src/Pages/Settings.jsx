import AdminSettings from "../components/Admin/AdminSettings"
import EmployeeSettings from "../components/Employee/EmployeeSettings"
import { useAuth } from "../Context/authContext"

const Settings = () => {
  const { user } = useAuth()
  const isAdmin = user?.role === "ADMIN"

  if (isAdmin) return <AdminSettings />
  return <EmployeeSettings />
}

export default Settings
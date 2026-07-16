import AdminSettings from "../components/Admin/AdminSettings"
import EmployeeSettings from "../components/Employee/EmployeeSettings"

const Settings = () => {
  const role = "EMPLOYEE" // "ADMIN" ya "EMPLOYEE"

  if (role === "ADMIN") return <AdminSettings />
  return <EmployeeSettings />
}

export default Settings
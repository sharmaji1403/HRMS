import { useCallback, useEffect, useState } from "react"
import { dummyPayslipData } from "../assets/assets"
import Loading from "../components/Loading"
import AdminPayslips from "../components/Admin/AdminPayslips"
import EmployeePayslips from "../components/Employee/EmployeePayslips"

const Payslips = () => {
  const [payslips, setPayslips] = useState([])
  const [loading, setLoading] = useState(true)

  const role = "EMPLOYEE" // "ADMIN" ya "EMPLOYEE"

  const fetchPayslips = useCallback(() => {
    setPayslips(dummyPayslipData)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    fetchPayslips()
  }, [fetchPayslips])

  if (loading) return <Loading />

  if (role === "ADMIN") return <AdminPayslips payslips={payslips} />
  return <EmployeePayslips payslips={payslips} />
}

export default Payslips
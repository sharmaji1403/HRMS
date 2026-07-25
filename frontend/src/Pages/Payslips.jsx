import { useCallback, useEffect, useState } from "react"
import Loading from "../components/Loading"
import AdminPayslips from "../components/Admin/AdminPayslips"
import EmployeePayslips from "../components/Employee/EmployeePayslips"
import { useAuth } from "../Context/authContext"
import toast from "react-hot-toast"
import api from "../api/axios"

const Payslips = () => {
  const { user } = useAuth()
  const [payslips, setPayslips] = useState([])
  const [loading, setLoading] = useState(true)
  const isAdmin = user?.role === "ADMIN"

  const fetchPayslips = useCallback(async () => {
    try {
      const res = await api.get("/payslips")
      setPayslips(res.data.data || [])
    } catch (error) {
      toast.error(error.response?.data?.error || error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPayslips()
  }, [fetchPayslips])

  if (loading) return <Loading />

  if (isAdmin) return <AdminPayslips payslips={payslips} onRefresh={fetchPayslips} />
  return <EmployeePayslips payslips={payslips} />
}

export default Payslips
import { useCallback, useEffect, useState } from "react"
import Loading from "../components/Loading"
import AdminLeave from "../components/Admin/AdminLeave"
import EmployeeLeave from "../components/Employee/EmployeeLeave"
import { useAuth } from "../Context/authContext"
import toast from "react-hot-toast"
import api from "../api/axios"

const Leave = () => {
  const { user } = useAuth()
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const isAdmin = user?.role === "ADMIN"

  const fetchLeaves = useCallback(async () => {
    try {
      const res = await api.get("/leaves")
      setLeaves(res.data.data || [])
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLeaves()
  }, [fetchLeaves])

  if (loading) return <Loading />

  if (isAdmin) return <AdminLeave leaves={leaves} onRefresh={fetchLeaves} />
  return <EmployeeLeave leaves={leaves} showModal={showModal} setShowModal={setShowModal} onRefresh={fetchLeaves} />
}

export default Leave
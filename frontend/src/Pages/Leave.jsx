import { useCallback, useEffect, useState } from "react"
import { dummyLeaveData } from "../assets/assets"
import Loading from "../components/Loading"
import AdminLeave from "../components/Admin/AdminLeave"
import EmployeeLeave from "../components/Employee/EmployeeLeave"

const Leave = () => {
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const role = "EMPLOYEE" // "ADMIN" ya "EMPLOYEE"

  const fetchLeaves = useCallback(() => {
    setLeaves(dummyLeaveData)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    fetchLeaves()
  }, [fetchLeaves])

  if (loading) return <Loading />

  if (role === "ADMIN") return <AdminLeave leaves={leaves} />
  return <EmployeeLeave leaves={leaves} showModal={showModal} setShowModal={setShowModal} />
}

export default Leave
import { useCallback, useEffect, useState } from "react"
import Loading from "../Loading"
import toast from "react-hot-toast"
import api from "../../api/axios"

import AttendanceStats from "./Attendance/AttendanceStats"
import ClockCard from "./Attendance/ClockCard"
import AttendanceTable from "./Attendance/AttendanceTable"

const EmployeeAttendance = () => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [clocking, setClocking] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get("/attendance")
      setHistory(res.data.data || [])
    } catch (error) {
      toast.error(error.response?.data?.error || error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleClock = async () => {
    setClocking(true)
    try {
      const res = await api.post("/attendance")
      toast.success(res.data.type === "CHECK_IN" ? "Clocked in!" : "Clocked out!")
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.error || error.message)
    } finally {
      setClocking(false)
    }
  }

  if (loading) return <Loading />

  const todayStr = new Date().toDateString()
  const todayRecord = history.find(a => new Date(a.date).toDateString() === todayStr)

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Attendance</h1>
        <p className="page-subtitle">Track your work hours and daily check-ins</p>
      </div>

      <AttendanceStats history={history} />
      <ClockCard todayRecord={todayRecord} clocking={clocking} onClock={handleClock} />
      <AttendanceTable history={history} />
    </div>
  )
}

export default EmployeeAttendance
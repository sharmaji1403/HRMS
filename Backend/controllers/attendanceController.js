const { inngest } = require("../inngest")
const Attendance = require("../models/Attendance")
const Employee = require("../models/Employee")

// POST /api/attendance
const clockIn = async (req, res) => {
    try {
        const session = req.session

        const employee = await Employee.findOne({ userId: session.userId })
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" })
        }
        if (employee.isDeleted) {
            return res.status(403).json({ error: "Your account is deleted" })
        }

        // Aaj ki date (time ke bina)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const now = new Date()

        // Aaj ki attendance check karo
        const existing = await Attendance.findOne({
            employeeId: employee._id,
            date: today
        })

        // ── Clock In ──────────────────────────────────────────
        if (!existing) {
            const isLate = now.getHours() >= 9 && now.getMinutes() > 0
            const attendance = await Attendance.create({
                employeeId: employee._id,
                date: today,
                checkIn: now,
                status: isLate ? "LATE" : "PRESENT"
            })
            await inngest.send({
                name: "employee/check-out",
                data: {
                    employeeId: employee._id,
                    attendanceId : attendance._id
                }
            })
            return res.status(201).json({ success: true, type: "CHECK_IN", data: attendance })
        }

        // ── Already Clocked Out ───────────────────────────────
        else if (existing.checkOut) {
            return res.status(400).json({ error: "Already clocked out for today" })
        }

        // ── Clock Out ─────────────────────────────────────────
        const diffMs = now.getTime() - new Date(existing.checkIn).getTime()
        const workingHours = Number((diffMs / (1000 * 60 * 60)).toFixed(2))

        let dayType = "Full Day"
        if (workingHours < 4) dayType = "Short Day"
        else if (workingHours < 6) dayType = "Half Day"

        const updated = await Attendance.findByIdAndUpdate(
            existing._id,
            { checkOut: now, workingHours, dayType },
            { new: true }
        )

        return res.status(200).json({ success: true, type: "CHECK_OUT", data: updated })

    } catch (error) {
        console.error("Clock in/out error:", error)
        return res.status(500).json({ error: "Failed to clock in/out" })
    }
}

// GET /api/attendance
const getAttendance = async (req, res) => {
    try {
        const session = req.session

        const employee = await Employee.findOne({ userId: session.userId })
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" })
        }

        const limit = parseInt(req.query.limit || 30)
        const history = await Attendance.find({ employeeId: employee._id })
            .sort({ date: -1 })
            .limit(limit)

        return res.json({
            data: history,
            employee: { isDeleted: employee.isDeleted }
        })

    } catch (error) {
        console.error("Get attendance error:", error)
        return res.status(500).json({ error: "Failed to fetch attendance" })
    }
}



module.exports = { clockIn, getAttendance }
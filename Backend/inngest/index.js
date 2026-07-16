const { Inngest } = require("inngest")
const Attendance = require("../models/Attendance")
const Employee = require("../models/Employee")
const { LeaveApplication } = require("../models/leaveApplication")
const { sendEmail } = require("../config/nodemailer")

const inngest = new Inngest({ id: "HRMS_fullStack" })

// ── 1. Auto Checkout ─────────────────────────────────────────
const autoCheckOut = inngest.createFunction(
    { id: "auto-checkout", triggers: [{ event: "employee/check-out" }] },
    async ({ event, step }) => {
        const { employeeId, attendanceId } = event.data

        await step.sleepUntil("wait-for-9-hours", new Date(Date.now() + 9 * 60 * 60 * 1000))

        let attendance = await step.run("get-attendance", async () => {
            return await Attendance.findById(attendanceId)
        })

        if (!attendance?.checkOut) {
            const employee = await step.run("get-employee", async () => {
                return await Employee.findById(employeeId)
            })

            await step.run("send-reminder-email", async () => {
                await sendEmail({
                    to: employee.email,
                    subject: "Attendance Check-Out Reminder",
                    body: `
                    <div style="max-width: 600px;">
                        <h2>Hi ${employee.firstName}, 👋</h2>
                        <p>You have not clocked out yet today.</p>
                        <p>Please make sure to check-out in one hour.</p>
                        <br/>
                        <p>Best Regards,<br/>EMS</p>
                    </div>`
                })
            })

            await step.sleepUntil("wait-for-1-hour", new Date(Date.now() + 1 * 60 * 60 * 1000))

            attendance = await step.run("get-attendance-after-1hr", async () => {
                return await Attendance.findById(attendanceId)
            })

            if (!attendance?.checkOut) {
                await step.run("mark-auto-checkout", async () => {
                    attendance.checkOut = new Date(new Date(attendance.checkIn).getTime() + 4 * 60 * 60 * 1000)
                    attendance.workingHours = 4
                    attendance.dayType = "Half Day"
                    attendance.status = "LATE"
                    await attendance.save()
                })
            }
        }
    }
)

// ── 2. Leave Application Reminder ───────────────────────────
const leaveApplicationReminder = inngest.createFunction(
    { id: "leave-application-reminder", triggers: [{ event: "leave/pending" }] },
    async ({ event, step }) => {
        const { leaveApplicationId, employeeName, leaveType, startDate, endDate } = event.data

        await step.sleepUntil("wait-for-24-hours", new Date(Date.now() + 24 * 60 * 60 * 1000))

        const leaveApplication = await step.run("check-leave-status", async () => {
            return await LeaveApplication.findById(leaveApplicationId)
        })

        if (leaveApplication?.status === "PENDING") {
            // ✅ step.run ke andar
            const employee = await step.run("get-employee", async () => {
                return await Employee.findById(leaveApplication.employeeId)
            })

            await step.run("send-admin-reminder", async () => {
                await sendEmail({
                    to: process.env.ADMIN_EMAIL,
                    subject: "Leave Application Reminder",
                    body: `
                    <div style="max-width: 600px;">
                        <h2>Hi Admin, 👋</h2>
                        <p>Leave application from <strong>${employeeName}</strong> is pending for 24 hours.</p>
                        <p>Leave Type: <strong>${leaveType}</strong></p>
                        <p>From: <strong>${startDate}</strong> To: <strong>${endDate}</strong></p>
                        <p>Please login and take action.</p>
                        <br/>
                        <p>Best Regards,<br/>EMS</p>
                    </div>`
                })
            })
        }
    }
)

// ── 3. Daily Absent Check ────────────────────────────────────
const dailyAbsentCheck = inngest.createFunction(
    { id: "daily-absent-check", triggers: [{ cron: "0 6 * * *" }] },
    async ({ step }) => {

        const today = await step.run("get-today-date", () => {
            const startUTC = new Date(new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) + "T00:00:00+05:30")
            const endUTC = new Date(startUTC.getTime() + 24 * 60 * 60 * 1000)
            return { startUTC: startUTC.toISOString(), endUTC: endUTC.toISOString() }
        })

        const activeEmployees = await step.run("get-active-employees", async () => {
            const employees = await Employee.find({ isDeleted: false, employmentStatus: "ACTIVE" }).lean()
            return employees.map((e) => ({
                _id: e._id.toString(),
                firstName: e.firstName,
                lastName: e.lastName,
                email: e.email,
                department: e.department
            }))
        })

        const onLeaveIds = await step.run("get-on-leave-ids", async () => {
            const leaves = await LeaveApplication.find({
                status: "APPROVED",
                startDate: { $lte: new Date(today.endUTC) },
                endDate: { $gte: new Date(today.startUTC) }
            }).lean()
            return leaves.map((l) => l.employeeId.toString())
        })

        const todayAttendance = await step.run("get-today-attendance", async () => {
            const attendance = await Attendance.find({
                date: { $gte: new Date(today.startUTC), $lt: new Date(today.endUTC) }
            }).lean()
            return attendance.map((a) => a.employeeId.toString())
        })

        const absentEmployees = activeEmployees.filter(
            emp => !onLeaveIds.includes(emp._id) && !todayAttendance.includes(emp._id)
        )

        if (absentEmployees.length > 0) {
            await step.run("send-absent-emails", async () => {
                // ✅ return add kiya
                const emailPromises = absentEmployees.map((emp) =>
                    sendEmail({
                        to: emp.email,
                        subject: "Attendance Reminder: Please Mark Your Attendance",
                        body: `
                        <div style="max-width: 600px; font-family: Arial, sans-serif;">
                            <h2>Hi ${emp.firstName}, 👋</h2>
                            <p>We noticed you haven't marked your attendance yet today.</p>
                            <p>The deadline was <strong>11:30 AM</strong>.</p>
                            <p>Please check in ASAP or contact your admin.</p>
                            <br/>
                            <p>Department: ${emp.department}</p>
                            <br/>
                            <p>Best Regards,<br/><strong>QuickEMS</strong></p>
                        </div>`
                    })
                )
                await Promise.all(emailPromises)
            })
        }

        return {
            totalActive: activeEmployees.length,
            onLeave: onLeaveIds.length,
            todayAttendance: todayAttendance.length,
            absentEmployees: absentEmployees.length
        }
    }
)

const functions = [autoCheckOut, leaveApplicationReminder, dailyAbsentCheck]

module.exports = { inngest, functions }
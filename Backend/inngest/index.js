const { Inngest } = require("inngest");
const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");
const { LeaveApplication } = require("../models/LeaveApplication");
const { sendEmail } = require("../config/nodemailer");

// Client create kiya jo events send aur receive karega
const inngest = new Inngest({ id: "HRMS_fullStack" });

// Auto checkout for Employee
const autoCheckOut = inngest.createFunction(
    { id: "auto-checkout", triggers: [{ event: "employee/check-out" }] },
    async ({ event, step }) => {
        const { employeeId, attendanceId } = event.data;

        //wait for 9 hr
        await step.sleepUntil("wait-for-9-hours", new Date(new Date().getTime() + 9 * 60 * 60 * 1000))
        //get attendance data
        let attendance = await step.run("get-attendance", async () => {
            return await Attendance.findById(attendanceId);
        });

        if (!attendance?.checkOut) {
            //get employee data
            const employee = await step.run("get-employee", async () => {
                return await Employee.findById(employeeId)
            })

            // send reminder email 
            await sendEmail({
                to: employee.email,
                subject: "Attendance Check-Out Reminder",
                body: `
                <div style="max-width: 600px;">
                    <h2>Hi ${employee.firstName}, 👋</h2>
                    <p style="font-size: 16px;">You have a check-in in ${employee.department} today:</p>
                    <p style="font-size: 18px; font-weight: bold; color: #007bff; margin: 8px 0;">${attendance?.checkIn?.toLocaleTimeString()}</p>
                    <p style="font-size: 16px;">Please make sure to check-out in one hour.</p>
                    <p style="font-size: 16px;">If you have any questions, please contact your admin.</p>
                    <br />
                    <p style="font-size: 16px;">Best Regards,</p>
                    <p style="font-size: 16px;">EMS</p>
                </div>
            `
            })



            // after 10 hour , mark attendance as checked out  with the status late
            await step.sleepUntil("wait-for-1-hour", new Date(new Date().getTime() + 1 * 60 * 60 * 1000))

            attendance = await step.run("get-attendance-after-1hr", async () => {
                return await Attendance.findById(attendanceId)
            })
            if (!attendance?.checkOut) {
                attendance.checkOut = attendance.checkOut = new Date(new Date(attendance.checkIn).getTime() + 4 * 60 * 60 * 1000)
                attendance.workingHours = 4;
                attendance.dayType = "Half Day"
                attendance.status = "LATE";
                await attendance.save();
            }
        }
    },
);

// Leave application reminder ....send email to admin , if admin does not take action on leave application within 24 hour

const leaveApplicationReminder = inngest.createFunction(
    { id: "leave-application-reminder", triggers: [{ event: "leave/pending" }] },
    async ({ event, step }) => {
        const { employeeId, leaveApplicationId, employeeName, leaveType, startDate, endDate } = event.data

        // 24 ghante wait karo
        await step.sleepUntil("wait-for-24-hours", new Date(new Date().getTime() + 24 * 60 * 60 * 1000))

        // Leave status check karo
        const leaveApplication = await step.run("check-leave-status", async () => {
            return await LeaveApplication.findById(leaveApplicationId)
        })

        // Agar abhi bhi PENDING hai toh admin ko email bhejo
        if (leaveApplication?.status === "PENDING") {
            const employee = await Employee.findById(leaveApplication.employeeId)

            // Send reminder email to admin to take action on leave application
            await sendEmail({
                to: process.env.ADMIN_EMAIL,
                subject: "Leave Application Reminder",
                body: `
            <div style="max-width: 600px;">
                <h2>Hi Admin, 👋</h2>
                <p style="font-size: 16px;">You have a leave application in ${employee.department} today:</p>
                <p style="font-size: 18px; font-weight: bold; color: #007bff; margin: 8px 0;">${leaveApplication?.startDate?.toLocaleDateString()}</p>
                <p style="font-size: 16px;">Please make sure to take action on this leave application.</p>
                <br />
                <p style="font-size: 16px;">Best Regards,</p>
                <p style="font-size: 16px;">EMS</p>
            </div>
        `
            })
        }
    }
)

// Cron : check attendance  at 11.30 AM IST (06:00 UTC) and email absent employees

const dailyAbsentCheck = inngest.createFunction(
    { id: "daily-absent-check", triggers: [{ cron: "0 6 * * *" }] }, // 6 AM UTC = 11:30 AM IST
    async ({ step }) => {

        // Aaj ki date
        const today = await step.run("get-today-date", () => {
            const startUTC = new Date(new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) + "T00:00:00 +05:30");
            const endUTC = new Date(startUTC.getTime() + 24 * 60 * 60 * 1000);
            return { startUTC: startUTC.toISOString(), endUTC: endUTC.toISOString() };
        })

        // Sab active employees fetch karo
        const activeEmployees = await step.run("get-active-employees", async () => {
            const employees = await Employee.find({ isDeleted: false, employmentStatus: "ACTIVE" }).lean()
            return employees.map((e) => ({ _id: e._id.toString(), firstName: e.firstName, lastName: e.lastName, email: e.email, department: e.department }));
        })

        // Get employees IDs on approved leave today
        const onLeaveIds = await step.run("get-on-leave-ids", async () => {
            const leaves = await LeaveApplication.find({
                status: "APPROVED",
                startDate: { $lte: new Date(today.endUTC) },
                endDate: { $gte: new Date(today.startUTC) }
            }).lean()
            return leaves.map((l) => l.employeeId.toString())
        })

        // Aaj ki attendance fetch karo
        const todayAttendance = await step.run("get-today-attendance", async () => {
            const attendance = await Attendance.find({ date: { $gte: new Date(today.startUTC), $lt: new Date(today.endUTC) } }).lean()
            return attendance.map((a) => a.employeeId.toString())
        });

        // Absent employees dhundo
        const absentEmployees = activeEmployees.filter(
            emp => !onLeaveIds.includes(emp._id) && !todayAttendance.includes(emp._id))

        // Har absent employee ko email bhejo
        if (absentEmployees.length > 0) {
            await step.run("send-absent-emails", async () => {
                const emailPromises = absentEmployees.map((emp) => {
                    // send email 
                     sendEmail({
                        to: emp.email,
                        subject: "Attendance Reminder Please Mark your attendance",
                        body:  `
                            <div style="max-width: 600px; font-family: Arial, sans-serif;">
                                <h2>Hi ${emp.firstName}, 👋</h2>
                                <p style="font-size: 16px;">We noticed you haven't marked your attendance yet today.</p>
                                <p style="font-size: 16px;">The deadline was <strong>11:30 AM</strong> and your attendance is still missing.</p>
                                <p style="font-size: 16px;">Please check in as soon as possible or contact your admin if you're facing any issues.</p>
                                <br />
                                <p style="font-size: 14px; color: #666;">Department: ${emp.department}</p>
                                <br />
                                <p style="font-size: 16px;">Best Regards,</p>
                                <p style="font-size: 16px;"><strong>QuickEMS</strong></p>
                            </div>
                        `
                    })

                })
            })
        }
        return { totalActive: activeEmployees.length, onLeave: onLeaveIds.length, todayAttendance: todayAttendance.length, absentEmployees: absentEmployees.length }
    });



// Empty array jisme future Inngest functions ko export karenge
const functions = [autoCheckOut, leaveApplicationReminder, dailyAbsentCheck];

// Saare variables ko ek sath export kar diya
module.exports = { inngest, functions };
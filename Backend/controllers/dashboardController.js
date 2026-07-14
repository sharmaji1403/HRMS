const { DEPARTMENTS } = require("../constants/department");
const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");
const { LeaveApplication } = require("../models/LeaveApplication");


// Get dashboard for employee and admin
// GET  /api/dashboard

const getDashboard = async( req , res) => {
    try {
        const session = req.session;
        if(session.role === "ADMIN"){
            const[totalEmployees , todayAttendance ,pendingLeaves] = await Promise.all([ 
                Employee.countDocuments({isDeleted:{$ne: true}}),
                Attendance.countDocuments({
                    date: {
                        $gte: new Date(new Date().setHours(0,0,0,0)),
                        $lt: new Date(new Date().setHours(24,0,0,0)),
                    }
                }),
                LeaveApplication.countDocuments({status: "PENDING"})
            ])
            return res.json({
                role: "ADMIN",
                totalEmployees,
                totalDepartments: DEPARTMENTS.length,
                todayAttendance,
                pendingLeaves
            })
        }
        else{
            const employee = await Employee.findOne({
                userId: session.userId,
            }).lean();
            if(!employee) return res.status(404).json({error: "Employee not found"});
            
            const today = new Date();
            const[currentMonthAttendance , pendingLeaves] = await Promise.all ([
                Attendance.countDocuments({
                    employeeId : employee._id,
                    date: {
                        $gte: new Date(today.getFullYear(), today.getMonth(),1),
                        $lt: new Date(today.getFullYear(), today.getMonth(),+1,1),
                    }
                }).
                LeaveApplication.countDocuments({
                    employeeId: employee._id,
                    status: "PENDING"
                })
            ])
            return res.json({
                role : "EMPLOYEE",
                employee: {...employee , id:employee._id.toString()},
                currentMonthAttendance,
                pendingLeaves
            })
        }
    } catch (error) {
        console.error("Dashboard error:", error)
        return res.status(500).json({error: "Failed"});
    }
}

module.exports = {getDashboard}
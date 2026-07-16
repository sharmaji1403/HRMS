const { LeaveApplication } = require("../models/LeaveApplication")
const Employee = require("../models/Employee")
const { inngest } = require("../inngest")

// 1. Create Leave
// POST /api/leaves
const createLeave = async (req, res) => {
    try {
        const session = req.session
    
        const employee = await Employee.findOne({ userId: session.userId })
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" })
        }
        if (employee.isDeleted) {
            return res.status(403).json({ error: "Your account is deleted" })
        }

        const { type, startDate, endDate, reason } = req.body

        if (!type || !startDate || !endDate || !reason) {
            return res.status(400).json({ error: "All fields are required" })
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if(new Date(startDate) <= today || new Date(endDate) <= today){
            return res.status(400).json({ error: "Leave dates cannot be in the past" })
        }

        if(new Date(endDate) < new Date(startDate)){
            return res.status(400).json({ error: "End date cannot be before start date" })
        }


        const leave = await LeaveApplication.create({
            employeeId: employee._id,
            type,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            reason,
            status: "PENDING"
        })

        await inngest.send({
            name: "leave/pending",
            date: {leaveApplicationId : leave._id,}
        })
        
        return res.status(201).json({ success: true, leave })

    } catch (error) {
        console.error("Create leave error:", error)
        return res.status(500).json({ error: "Failed to create leave" })
    }
}

// 2. Get Leaves
// GET /api/leaves
const getLeaves = async (req, res) => {
    try {
        const session = req.session
        const isAdmin = session.role === "ADMIN";
        // Admin — sab leaves
        if (isAdmin) {
            const { status } = req.query.status;
            const where = status ? {status} : {};

            const leaves = await LeaveApplication.find(where)
                .populate("employeeId", "firstName lastName department position")
                .sort({ createdAt: -1 });
                const data = leaves.map((l)=> {
                    const obj = l.toobject();
                    return{
                        ...obj,
                        id: obj._id.toString(),
                        employee: obj.employeeId , 
                        employeeId: obj.employeeId._id.toString(),
                    }
                })
                
            return res.json({data});
        }

        // Employee — sirf apni leaves
        const employee = await Employee.findOne({ userId: session.userId }) .lean();
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" })
        }

        const leaves = await LeaveApplication.find({ employeeId: employee._id })
            .sort({ createdAt: -1 })

        return res.json({
            data: leaves,
            employee: { ...employee , id: employee._id.toString()}
        });

    } catch (error) {
        console.error("Get leaves error:", error)
        return res.status(500).json({ error: "Failed to fetch leaves" })
    }
}

// 3. Update Leave Status (Admin — Approve/Reject)
// PATCH /api/leaves/:id
const updateLeaveStatus = async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body

        if (!["APPROVED", "REJECTED"].includes(status)) {
            return res.status(400).json({ error: "Invalid status" })
        }

        const leave = await LeaveApplication.findById(id)
        if (!leave) {
            return res.status(404).json({ error: "Leave not found" })
        }
        if (leave.status !== "PENDING") {
            return res.status(400).json({ error: "Leave already processed" })
        }

        const updated = await LeaveApplication.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        )

        return res.json({ success: true, leave: updated })

    } catch (error) {
        console.error("Update leave error:", error)
        return res.status(500).json({ error: "Failed to update leave" })
    }
}

module.exports = { createLeave, getLeaves, updateLeaveStatus: updateLeaveStatus }
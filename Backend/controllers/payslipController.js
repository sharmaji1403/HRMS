const Payslip = require("../models/Payslip")
const Employee = require("../models/Employee")

// 1. Create Payslip (Admin)
// POST /api/payslips
const createPayslip = async (req, res) => {
    try {
        const session = req.session
        const { employeeId, month, year, basicSalary, allowances, deductions } = req.body

        if (!employeeId || !month || !year || basicSalary === undefined) {
            return res.status(400).json({ error: "Employee, month, year and basic salary are required" })
        }

        const employee = await Employee.findById(employeeId)
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" })
        }

        const basic = Number(basicSalary) || 0
        const allow = Number(allowances) || 0
        const deduct = Number(deductions) || 0
        const netSalary = basic + allow - deduct

        const payslip = await Payslip.create({
            employeeId,
            month: Number(month),
            year: Number(year),
            basicSalary: basic,
            allowances: allow,
            deductions: deduct,
            netSalary,
            generatedBy: session.userId,
        })

        return res.status(201).json({ success: true, payslip })

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: "Payslip already exists for this employee and period" })
        }
        console.error("Create payslip error:", error)
        return res.status(500).json({ error: "Failed to create payslip" })
    }
}

// 2. Get Payslips
// GET /api/payslips
const getPayslips = async (req, res) => {
    try {
        const session = req.session
        const isAdmin = session.role === "ADMIN"

        if (isAdmin) {
            const payslips = await Payslip.find({})
                .populate("employeeId", "firstName lastName department position")
                .sort({ year: -1, month: -1 })

            const data = payslips.map((p) => {
                const obj = p.toObject()
                return {
                    ...obj,
                    id: obj._id.toString(),
                    employee: obj.employeeId,
                    employeeId: obj.employeeId?._id?.toString(),
                }
            })

            return res.json({ data })
        }

        const employee = await Employee.findOne({ userId: session.userId }).lean()
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" })
        }

        const payslips = await Payslip.find({ employeeId: employee._id })
            .sort({ year: -1, month: -1 })
            .lean()

        // ✅ Har payslip ke saath employee info bhi attach karo (print page ke liye)
        const data = payslips.map((p) => ({
            ...p,
            id: p._id.toString(),
            employee: {
                firstName: employee.firstName,
                lastName: employee.lastName,
                email: employee.email,
                position: employee.position,
                department: employee.department,
            }
        }))

        return res.json({
            data,
            employee: { ...employee, id: employee._id.toString() }
        })

    } catch (error) {
        console.error("Get payslips error:", error)
        return res.status(500).json({ error: "Failed to fetch payslips" })
    }
}

// 3. Mark as Paid (Admin)
// PATCH /api/payslips/:id
const markPaid = async (req, res) => {
    try {
        const { id } = req.params

        const payslip = await Payslip.findById(id)
        if (!payslip) {
            return res.status(404).json({ error: "Payslip not found" })
        }
        if (payslip.status === "PAID") {
            return res.status(400).json({ error: "Already marked as paid" })
        }

        const updated = await Payslip.findByIdAndUpdate(
            id,
            { status: "PAID" },
            { new: true }
        )

        return res.json({ success: true, payslip: updated })

    } catch (error) {
        console.error("Mark paid error:", error)
        return res.status(500).json({ error: "Failed to update payslip" })
    }
}

module.exports = { createPayslip, getPayslips, markPaid }
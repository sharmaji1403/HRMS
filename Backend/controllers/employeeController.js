const Employee = require("../models/Employee");
const bcrypt = require("bcrypt");
const User = require("../models/User");



// Get employees
// GET method   /api/employees  ........return employee data  
const getEmployee = async (req, res) => {
    try {
        const { department } = req.query;
        const where = {};
        if (department) where.department = department;

        const employee = (await Employee.find(where))
            .sort({ createdAt: -1 })
            .populate("userId", "email role")
            .lean();

        const result = employee.map((emp) => ({
            ...emp,
            id: emp._id.toString(),
            user: emp.userId ? { email: emp.userId.email, role: emp.userId.role } : null
        }))
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch employee" })
    }
}

module.exports = getEmployee;



// Create employee
// POST method     /api/employees    ...........for creating new employee
const createEmployee = async (req, res) => {

    try {
        const { firstName, lastName, email, phone, position, department, basicSalary,
            allowances, deductions, joinDate, password, role, bio } = req.body

        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            password: hashed,
            role: role || "EMPLOYEE"
        })

        const employee = await Employee.create({
            userId: user._id,
            firstName,
            lastName,
            email,
            phone,
            position,
            department: department || "Engineering",
            basicSalary: Number(basicSalary) || 0,
            allowances: Number(allowances) || 0,
            deductions: Number(deductions) || 0,
            joinDate: new Date(joinDate),
            bio: bio || " ",
        })

        return res.status(201).json({ success: true, employee })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: "Email Already exists" })
        }
        console.error("Create employee error:", error)
        return res.status(500).json({ error: "failed to create employee" })
    }
}
module.exports = createEmployee;



// Update employee
// PUT method.    /api/employees/:id     ..........find and update employee
const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, phone, position, department, basicSalary,
            allowances, deductions, password, role, bio , employmentStatus } = req.body

        const employee = await Employee.findById(id);
        if (!employee) return res.status(404).json({ error: "Employee not found" })

         await Employee.findByIdAndUpdate(id, {
            firstName,
            lastName,
            email,
            phone,
            position,
            department: department || "Engineering",
            basicSalary: Number(basicSalary) || 0,
            allowances: Number(allowances) || 0,
            deductions: Number(deductions) || 0,
            employmentStatus : employmentStatus || "ACTIVE",
            bio: bio || " ",
        })

        // Update User record

        const userUpdate = { email}
        if(role) userUpdate.role = role;
        if(password) userUpdate.password = await bcrypt.hash(password , 10);
        await User.findByIdAndUpdate(employee.userId , userUpdate)
        

        return res.json({ success: true})
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: "Email Already exists" })
        }
        return res.status(500).json({ error: "failed to create employee" })
    }
}
module.exports = updateEmployee;



// Delete employee
// DELETE method.    /api/employees/:id     ..........find and DELETE employee
const deleteEmployee = async (req, res) => {
    try {
        const {id} = req.params;
        const employee = await Employee.findById(id)
        if(!employee) return res.status(404).json({error: "Employee not found"});

        employee.isDeleted = true;
        employee.employmentStatus = "INACTIVE"
        await employee.save()
        return res.json ({success: true});
    } catch (error) {
        return res.status(500).json({error : "Failed to delete employee"});
    }
 }
module.exports = deleteEmployees;


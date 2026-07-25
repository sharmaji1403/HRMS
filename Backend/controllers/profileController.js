const Employee = require("../models/Employee")

// Get profile
// GET /api/profile

const getProfile = async(req , res) => {
    try {
        const session = req.session
        const employee = await Employee.findOne({userId: session.userId})
        
        if(!employee){
            // Authenticated user is no an employee - return admin profile
            return res.json({
                firstName: "Admin",
                lastName: " ",
                email: session.email,
            })
        }
        return res.json(employee)
    } catch (error) {
        console.error("Update profile error:", error)
        return res.status(500).json({error: "Failed to fetch profile"});
    }
}


// Update profile
// PUT /api/profile

const updateProfile = async(req, res) => {
    try {
        const session = req.session
        const employee = await Employee.findOne({ userId: session.userId })
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" })
        }
        if (employee.isDeleted) {
            return res.status(403).json({ error: "Your account is deactivated. You cannot update your profile" })
        }

        const { firstName, lastName, position, bio } = req.body
        await Employee.findByIdAndUpdate(employee._id, {
            firstName: firstName ?? employee.firstName,
            lastName: lastName ?? employee.lastName,
            position: position ?? employee.position,
            bio: bio ?? employee.bio,
        })
        return res.json({ success: true })
    } catch (error) {
        console.error("Update profile error:", error)
        return res.status(500).json({ error: "Failed to update profile" })
    }
}
module.exports = {getProfile,updateProfile};
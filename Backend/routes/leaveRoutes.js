const express = require("express")
const { createLeave, getLeaves, updateLeaveStatus } = require("../controllers/leaveController")
const { protect, protectAdmin } = require("../Middleware/auth")

const leaveRouter = express.Router()

leaveRouter.post("/", protect, createLeave)
leaveRouter.get("/", protect, getLeaves)
leaveRouter.patch("/:id", protect, protectAdmin, updateLeaveStatus)

module.exports = leaveRouter;
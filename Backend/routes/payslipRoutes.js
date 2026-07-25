const express = require("express")
const { createPayslip, getPayslips, markPaid } = require("../controllers/payslipController")
const { protect, protectAdmin } = require("../Middleware/auth")

const payslipRouter = express.Router()

payslipRouter.post("/", protect, protectAdmin, createPayslip)
payslipRouter.get("/", protect, getPayslips)
payslipRouter.patch("/:id", protect, protectAdmin, markPaid)

module.exports = payslipRouter
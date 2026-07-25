const mongoose = require("mongoose")

const payslipSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
    },
    month: {
        type: Number,       // 1-12
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    basicSalary: {
        type: Number,
        required: true,
        default: 0,
    },
    allowances: {
        type: Number,
        default: 0,
    },
    deductions: {
        type: Number,
        default: 0,
    },
    netSalary: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["GENERATED", "PAID"],
        default: "GENERATED",
    },
    generatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",   // kaunse admin ne generate kiya
    },
}, { timestamps: true })

// Ek employee ka ek hi payslip per month/year ho sakta hai
payslipSchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true })

const Payslip = mongoose.models.Payslip || mongoose.model("Payslip", payslipSchema)

module.exports = Payslip
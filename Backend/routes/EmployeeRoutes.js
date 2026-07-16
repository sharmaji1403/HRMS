const express = require("express");
const { 
    getEmployee, createEmployee, updateEmployee, deleteEmployee } = require("../controllers/employeeController");
const { protect, protectAdmin } = require("../Middleware/auth");

const employeeRouter = express.Router();

employeeRouter.get("/" , protect, protectAdmin, getEmployee);
employeeRouter.post("/" ,protect, protectAdmin, createEmployee);
employeeRouter.put("/:id" ,protect, protectAdmin, updateEmployee);
employeeRouter.delete("/:id" ,protect, protectAdmin, deleteEmployee);

module.exports = employeeRouter;
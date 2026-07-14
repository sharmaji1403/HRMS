const express = require("express");
const { 
    getEmployees, createEmployee, updateEmployee, deleteEmployee } = require("../controllers/employeeController");
const { protect, protectAdmin } = require("../Middleware/auth");

const employeeRouter = express.Router();

employeeRouter.get("/" , protect, protectAdmin, getEmployees);
employeeRouter.post("/" ,protect, protectAdmin, createEmployee);
employeeRouter.put("/:id" ,protect, protectAdmin, updateEmployee);
employeeRouter.delete("/:id" ,protect, protectAdmin, deleteEmployee);

module.exports = employeeRouter;
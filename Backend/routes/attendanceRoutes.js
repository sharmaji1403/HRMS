const express = require("express");
const { protect } = require("../Middleware/auth");
const { clockIn, getAttendance } = require("../controllers/attendanceController");

const attendanceRouter = express.Router();


attendanceRouter.post("/", protect , clockIn);
attendanceRouter.get("/",protect , getAttendance);



module.exports = attendanceRouter;
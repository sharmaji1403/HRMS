const express = require("express");
const { protect } = require("../Middleware/auth");
const { getDashboard } = require("../controllers/dashboardController");

const dashboardRouter = express.Router();

dashboardRouter.get("/" , protect, getDashboard)

module.exports = { dashboardRouter}
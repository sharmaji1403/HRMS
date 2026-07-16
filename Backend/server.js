require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectionDB = require('./config/db')
const authRouter = require('./routes/authRoutes')
const employeeRouter = require('./routes/EmployeeRoutes')
const profileRouter = require('./routes/profileRoutes')
const attendanceRouter = require('./routes/attendanceRoutes')
const leaveRouter = require('./routes/leaveRoutes')
const { dashboardRouter } = require('./routes/dashboardRoutes')

const { serve } = require("inngest/express");
const { inngest, functions } = require("./inngest/index");

const app = express()
const PORT = process.env.PORT || 8000

//Middleware
app.use(cors())
app.use(express.json())


// Routes
app.get("/" , (req , res) => {
    res.send("Server in running on port 8000")
});
app.use("/api/auth" , authRouter);
app.use("/api/employees" , employeeRouter);
app.use("/api/profile" , profileRouter);
app.use("/api/attendance" , attendanceRouter)
app.use("/api/leaves", leaveRouter) 
app.use("/api/dashboard", dashboardRouter)

app.use("/api/inngest", serve({ client: inngest, functions }));

const startServer = async () => {
  await connectionDB()
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}

startServer();
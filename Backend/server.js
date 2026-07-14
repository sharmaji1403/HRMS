require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectionDB = require('./config/db')
const authRouter = require('./routes/authRoutes')
const employeeRouter = require('./routes/EmployeeRoutes')
const profileRouter = require('./routes/profileRoutes')
const attendanceRouter = require('./routes/attendanceRoutes')

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

const startServer = async () => {
  await connectionDB()
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}

startServer();
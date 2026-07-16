const mongoose = require("mongoose");

const connectionDB = async () => {
    try{
        mongoose.connection.on("connected" , ()=> console.log("database connected"))
        await mongoose.connect(process.env.MONGODB_URI) 
    } catch (error) { 
        console.error("Database connection failed:" , error.message)
    }
}

module.exports = connectionDB
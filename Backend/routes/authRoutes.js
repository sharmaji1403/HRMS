const express = require("express");
const { login, session, changePassword } = require("../controllers/authController");
const { protect } = require("../Middleware/auth");


const authRouter = express.Router();

authRouter.get("/session" ,protect, session);
authRouter.post("/login" ,login);
authRouter.post("/change-password" ,protect, changePassword);


module.exports = authRouter;
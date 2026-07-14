const express = require("express");
const { protect } = require("../Middleware/auth");
const { getProfile, updateProfile } = require("../controllers/profileController");


const profileRouter = express.Router();

profileRouter.get("/", protect , getProfile)
profileRouter.post("/", protect , updateProfile);


module.exports = profileRouter;
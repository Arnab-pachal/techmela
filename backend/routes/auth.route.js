import express from "express"
import { updateProfilepic,updateProfile,checkAuth,login,signup,logout,allUser } from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"
import {send,verify,updateInfo} from "../controllers/otp.controller.js"
import { checkHost } from "../middleware/master.auth.middleware.js"
 const router = express.Router()
router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)
router.post("/send-otp",send)
router.post("/verify-otp",verify)
router.post("/forgotpass",updateInfo)
router.put("/update-profile",protectRoute,updateProfilepic);
router.put("/updateName",protectRoute,updateProfile)
router.get("/check",protectRoute,checkAuth)
router.get("/allUser",checkHost,allUser)
export default router;
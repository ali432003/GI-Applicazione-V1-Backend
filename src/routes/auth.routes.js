import express from "express";
import {
  createAdmin,
  forgotPassword,
  getAllUsers,
  login,
  loginAdmin,
  logout,
  signup,
  verifEmail,
} from "../controllers/auth.controller.js";
import { Auth } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/verif.middleware.js";


const router = express.Router();

// client/user - authentication routes
router.post("/create-client", Auth, checkRole(["ADMIN"]), signup);
router.post("/login-client", checkRole(["USER"]), login);           
router.post("/logout-client", Auth, checkRole(["USER"]), logout); //optional

// admin - authentication routes
router.get("/users", Auth, checkRole(["ADMIN"]), getAllUsers);
router.post("/register-admin", createAdmin);
router.post("/login-admin", loginAdmin);

//forgot - password
router.post("/verify-email", verifEmail)
router.patch("/update-pass", forgotPassword)


export default router;

import "dotenv/config";
import jwt from "jsonwebtoken";
import { generateAndSaveToken } from "../lib/utils.js";
import prisma from "../../prisma/prisma.js";

export const checkRole = (requiredRoles) => {
  return async (req, res, next) => {
    try {
      let role = req.user?.role; //ADMIN
      if(!role){
        role = "USER"
      }
      // console.log(role)
      if (!requiredRoles.includes(role)) {
        return res
          .status(403)
          .json({ message: "Forbidden: You don't have permission" });
      }
      next();
    } catch (error) {
      // console.log(error.message);
      return res.status(401).json({ message: error.message });
    }
  };
};

import prisma from "../../prisma/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAndSaveToken } from "../lib/utils.js";

const { sign } = jwt;

export const signup = async (req, res) => {
  try {
    const { id } = req.user;
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const exist = await prisma.user.findUnique({ where: { email: email } });
    if (exist) {
      return res.status(400).json({ error: "User already exists" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        adminId: id,
        password: hash,
      },
    });
    return res
      .status(201)
      .json({ message: "User created successfully", data: user });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) return res.status(400).json({ message: "Invalid Email" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Invalid Password" });
    }
    generateAndSaveToken(user, res);
    return res.status(200).json({ message: "Login successful", data: user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "logout sucessfull" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; //optional

export const getAllUsers = async (req, res) => {
  try {
    const { id } = req.user;
    const users = await prisma.user.findMany({ where: { adminId: id } });
    if (!users) {
      return res.status(404).json({ message: "No user found", data: [] });
    }
    return res.status(200).json({ data: users, message: "All users fetched" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const createAdmin = async (req, res) => {
  try {
    let count = Math.round(Math.random() * 100);
    const email = `admin${count}@gmail.com`;
    const name = `admin${count}`;
    const password = `admin1234${count}`;

    const hash = await bcrypt.hash(password, 10);
    const admin = await prisma.admin.create({
      data: { email, name, password: hash },
    });
    if (!admin) {
      return res.status(400).json({ message: "Admin not created" });
    }
    generateAndSaveToken(admin, res);
    return res
      .status(200)
      .json({ message: "Admin created", data: { email, password } });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({ message: "All fields are required" });
    }
    const user = await prisma.admin.findUnique({ where: { email: email } });
    if (!user) return res.status(400).json({ message: "Email not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong Password" });
    generateAndSaveToken(user, res);
    return res
      .status(200)
      .json({ message: "Admin logged in Successfully", data: user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

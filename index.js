import "dotenv/config";
import express from "express";
import authRouter from "./src/routes/auth.controller.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});

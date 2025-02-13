import "dotenv/config";
import express from "express";
import authRouter from "./src/routes/auth.routes.js";
import orderRouter from "./src/routes/orders.routes.js"
import cookieParser from "cookie-parser";
import cors from "cors";
// import rateLimit from "express-rate-limit";

const app = express();
const port = process.env.PORT || 3000;

// const limiter = rateLimit({
//   windowMs: 3 * 1000, //3 sec per Request
//   max: 1,
//   message: "Too many requests from this IP, please try again later.",
//   headers: true,
// });

// app.use(limiter)

app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/order", orderRouter);

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});

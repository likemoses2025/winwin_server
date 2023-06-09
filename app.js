import express from "express";
import { config } from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import cors from "cors";

config({
  path: "./data/config.env",
});

export const app = express();

// Using Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT"],
    origin: [process.env.FRONTEND_URL_1, process.env.FRONTEND_URL_2],
  })
);

// Import Routers
import user from "./routes/user.js";
import product from "./routes/product.js";
import order from "./routes/order.js";
import refund from "./routes/refund.js";

app.use("/api/v1/user", user);
app.use("/api/v1/product", product);
app.use("/api/v1/order", order);
app.use("/api/v1/refund", refund);

// Using Error Middleware
app.use(errorMiddleware);

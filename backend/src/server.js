import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import templateRoutes from "./routes/template.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;


app.use(cors({ origin: process.env.NODE_ENV === "development" ? "http://localhost:5173" : "https://improved-ast-mern.vercel.app", credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use("/api/auth", authRoutes);
app.use("/api/template", templateRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port  http://localhost:${PORT}`);
});

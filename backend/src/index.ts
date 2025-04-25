import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./auth/auth.routes.js";
import usersRouter from "./users/users.routes.js";
import errorHandler from "./middlewares/errorHandler.js";
import taskRouter from "./tasks/tasks.routes.js";
import cookieParser from "cookie-parser";
import listsRouter from "./lists/lists.routes.js";

dotenv.config();

const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).send("Hello, world!");
});
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/tasks", taskRouter);
app.use("/lists", listsRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

const mongoURI = process.env.MONGO_URI || "";

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((error) => {
    console.error("�� MongoDB connection failed:", error.message);
    process.exit(1);
  });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

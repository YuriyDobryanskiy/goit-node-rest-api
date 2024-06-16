import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import contactsRouter from "./routes/contactsRouter.js";
import usersRouter from "./routes/usersRouter.js";
import { checkToken } from "./middlewares/checkTokenMiddleware.js";

const DB_KEY = process.env.DB_KEY;

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);
app.use("/api/users", usersRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

mongoose
  .connect(DB_KEY)
  .then(() => {
    console.log("Connected to database");
    app.listen(8080, () => {
      console.log("Server is running. Use our API on port: 8080");
    });
  })
  .catch((e) => {
    console.error("Database connection error", e);
    process.exit(1);
  });

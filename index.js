import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import notesRouter from "./routes/notes.js";
import usersRouter from "./routes/users.js";
import emailRouter from "./routes/email.js";
import paymentRouter from "./routes/payment.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// routes
app.use("/notes", notesRouter);
app.use("/users", usersRouter);
app.use("/email", emailRouter);
app.use("/payment", paymentRouter);

// test endpoint
app.get("/", (req, res) => {
  res.send("API berjalan 🚀");
});

// koneksi database (aman untuk serverless)
let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("Database connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

connectDB();

// export untuk Vercel
export default app;

// hanya untuk local development
if (process.env.NODE_ENV !== "production") {
  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

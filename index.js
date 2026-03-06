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

// koneksi database (serverless safe)
let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("Database connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

// connect saat server start
await connectDB();

// test endpoint
app.get("/", (req, res) => {
  res.send("API berjalan 🚀");
});

app.get("/env-test", (req, res) => {
  res.json({
    mongo: process.env.MONGO_URI ? "OK" : "missing",
    midtrans: process.env.MIDTRANS_SERVER_KEY ? "OK" : "missing",
    email: process.env.EMAIL_USER ? "OK" : "missing",
  });
});

// routes
app.use("/notes", notesRouter);
app.use("/users", usersRouter);
app.use("/email", emailRouter);
app.use("/payment", paymentRouter);

// export untuk Vercel
export default app;

// hanya untuk local
if (process.env.NODE_ENV !== "production") {
  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

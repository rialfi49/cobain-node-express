import express from "express";
import mongoose from "mongoose";
import notesRouter from "./routes/notes.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("YUSRI DISINI");
});

app.use("/notes", notesRouter);

mongoose.connect(process.env.MONGODB_URI);

export default app;

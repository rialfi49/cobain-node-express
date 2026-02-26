import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import notesRouter from "./routes/notes.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors({ origin: "*" }));

app.use(express.json());
app.use("/notes", notesRouter);

await mongoose.connect(process.env.MONGO_URI);
console.log("Database connected");

app.listen(8080, () => {
  console.log("Server running on port 3000");
});

// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import notesRouter from "./routes/notes.js";

// dotenv.config();

// const app = express();

// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("YUSRI DISINI");
// });

// app.use("/notes", notesRouter);

// const PORT = process.env.PORT || 3000;

// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => {
//     console.log("Database connected");

//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("Database connection error:", err);
//   });

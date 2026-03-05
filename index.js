import dotenv from "dotenv";
dotenv.config(); //HARUS PALING ATAS, sebelum import lain

import express from "express";
import mongoose from "mongoose";
import notesRouter from "./routes/notes.js";
import usersRouter from "./routes/users.js";
import emailRouter from "./routes/email.js";
import paymentRouter from "./routes/payment.js";

import cors from "cors";

console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("MIDTRANS_SERVER_KEY:", process.env.MIDTRANS_SERVER_KEY);
console.log("MIDTRANS_CLIENT_KEY:", process.env.MIDTRANS_CLIENT_KEY);

const app = express();

app.use(cors({ origin: "*" }));

app.use(express.json());
app.use("/notes", notesRouter);
app.use("/users", usersRouter);
app.use("/email", emailRouter);
app.use("/payment", paymentRouter);
// app.use("/email", (await import("./routes/email.js")).default);

await mongoose.connect(process.env.MONGO_URI);
console.log("Database connected");

// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });

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

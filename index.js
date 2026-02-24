import express from "express";

const app = express();

// app.use((req, res, next) => {
//   console.log(`lewat jalur ini${req.path}`);
//   next();
// });
app.use((err, req, res, next) => {
  if (false) {
    next(new Error("Not Authorized"));
    return;
  }
  next();
});

app.get("/", (req, res) => {
  res.send("Halo Yusri Alfiyya!");
});

app.get("/say/:greeting", (req, res) => {
  const { greeting } = req.params;
  res.send(greeting);
});

app.get("/coba", (req, res) => {
  res.send("KADA BATCH 3");
});

app.get("/cobalagi", (req, res) => {
  res.status(401).send("Error gan");
});

app.use((err, req, res, next) => {
  res.send("Error Occured");
});

app.listen(3000);
// app.listen(3000, () => {
//   console.log("Server running on http://localhost:3000");
// });

// app.use((err, req, res, next) => {
//   res.send('Error Occured')};)

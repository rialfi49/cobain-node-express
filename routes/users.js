import express from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import { sendEmail } from "../utils/sendEmail.js";
// import { sendEmail } from "../utils/sendEmail.js";
// import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// =====================
// GET Profile
// =====================
// router.get("/me", authMiddleware, async (req, res) => {
//   const user = await User.findById(req.user.id).select("-password");
//   res.json(user);
// });

// POST /users → buat user baru
router.post("/", async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword)
      return res.status(400).json({ message: "Semua field wajib diisi" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Password tidak cocok" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email sudah terdaftar" });

    // 🔥 Generate salt
    const salt = crypto.randomBytes(16).toString("hex");

    // 🔥 Hash password + salt (HASH password input pakai salt user)
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password + salt)
      .digest("hex");

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      salt: salt, // simpan salt di database
    });

    await newUser.save();

    //tambahin smtp kalau berhasil register akun
    // ✉️ Kirim email setelah register
    try {
      await sendEmail({
        to: email,
        subject: "Selamat Datang 🎉",
        text: `Halo ${username}, akun kamu berhasil dibuat!`,
        html: `
      <h2>Halo ${username} 👋</h2>
      <p>Akun kamu berhasil dibuat.</p>
      <p>Selamat menggunakan aplikasi 🚀</p>
    `,
      });
    } catch (emailError) {
      console.error("Gagal kirim email:", emailError.message);
      // Jangan gagalkan signup kalau email error
    }

    //////// end of smptp

    res.status(201).json({
      message: "User berhasil dibuat",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /users/login → login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email dan password wajib diisi" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "User tidak ditemukan" });

    // 🔥 Hash ulang input password + salt dari DB
    const hashedInputPassword = crypto
      .createHash("sha256")
      .update(password + user.salt)
      .digest("hex");

    const isMatch = hashedInputPassword === user.password;

    if (!isMatch)
      return res.status(401).json({ message: "Email atau password salah" });

    // ✅ BUAT JWT TOKEN
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.status(200).json({
      message: "Login berhasil",
      user: { id: user._id, username: user.username, email: user.email },
      token: token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

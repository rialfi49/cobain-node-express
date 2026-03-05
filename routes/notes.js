import { Router } from "express";
import { Post } from "../models/index.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();

// 🔐 Semua route pakai auth
router.use(authMiddleware);

// =====================
// GET ALL (hanya milik user login)
// =====================
router.get("/", async (req, res, next) => {
  try {
    const notes = await Post.find({ user: req.user.id }).populate(
      "user",
      "username email",
    ); // 🔥 tampilkan username/email
    res.json(notes);
  } catch (error) {
    next(error);
  }
});

// =====================
// GET BY ID (hanya milik user login)
// =====================
router.get("/:id", async (req, res, next) => {
  try {
    const note = await Post.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(note);
  } catch (error) {
    next(error);
  }
});

// =====================
// CREATE
// =====================
router.post("/", async (req, res, next) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      message: "Title and content are required",
    });
  }

  try {
    const note = await Post.create({
      title,
      content,

      // 🔥 tampilkan username/email
      // author: req.user.username,
      // author: req.user.username || req.user.email,

      // 🔐 relasi ke user
      user: req.user.id,
    });

    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
});

// =====================
// UPDATE (hanya milik user login)
// =====================
router.put("/:id", async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const updated = await Post.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id, // 🔐 pastikan hanya update miliknya
      },
      {
        title,
        content,
      },
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// =====================
// DELETE (hanya milik user login)
// =====================
router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await Post.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id, // 🔐 hanya bisa hapus miliknya
    });

    if (!deleted) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;

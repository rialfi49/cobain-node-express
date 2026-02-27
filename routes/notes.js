import { Router } from "express";
import { Post } from "../models/index.js";

const router = Router();

// =====================
// GET ALL
// =====================
router.get("/", async (req, res, next) => {
  try {
    const notes = await Post.find();
    res.json(notes);
  } catch (error) {
    next(error);
  }
});

// =====================
// GET BY ID
// =====================
router.get("/:id", async (req, res, next) => {
  try {
    const note = await Post.findById(req.params.id);

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
  const { author, title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      message: "Title and content are required",
    });
  }

  try {
    const note = await Post.create({ author, title, content });
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
});

// =====================
// UPDATE
// =====================
router.put("/:id", async (req, res, next) => {
  try {
    const { author, title, content } = req.body;

    const updated = await Post.findByIdAndUpdate(
      req.params.id,
      { author, title, content },
      { new: true }, // biar return data terbaru
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
// DELETE
// =====================
router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    next(error);
  }
});

// =====================
// BONUS: CREATE MULTIPLE
// =====================
router.post("/bulk", async (req, res, next) => {
  try {
    const notes = await Post.create(req.body);
    // body harus array of objects

    res.status(201).json(notes);
  } catch (error) {
    next(error);
  }
});

export default router;

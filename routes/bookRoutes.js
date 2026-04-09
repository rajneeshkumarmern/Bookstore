const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const { protect, admin } = require("../middleware/auth");

// ✅ GET all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ GET single book by _id
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ POST new book
router.post("/", protect, admin, async (req, res) => {
  try {
    const { title, author, price, image, description, category } = req.body;

    const newBook = new Book({
      title,
      author,
      price,
      image,
      description,
      category,
    });

    const savedBook = await newBook.save();

    res.status(201).json(savedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
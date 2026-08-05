const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const {
  createItem,
  getItems,
  getMyItems,
  getItem,
  updateItem,
  resolveItem,
  deleteItem,
} = require("../controllers/itemController");

const { protect } = require("../middleware/authMiddleware");

// ===============================
// Multer Storage
// ===============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
});

// ===============================
// Routes
// ===============================

// Create Item
router.post(
  "/",
  protect,
  upload.single("image"),
  createItem
);

// Get All Items
router.get("/", getItems);

// Get My Items
router.get("/my", protect, getMyItems);

// Get Single Item
router.get("/:id", getItem);

// Update Item
router.put(
  "/:id",
  protect,
  upload.single("image"),
  updateItem
);

// Mark Item as Resolved
router.put(
  "/:id/resolve",
  protect,
  resolveItem
);

// Delete Item
router.delete(
  "/:id",
  protect,
  deleteItem
);

module.exports = router;
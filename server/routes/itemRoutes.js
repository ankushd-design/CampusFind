const express = require("express");
const router = express.Router();

const {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem,
} = require("../controllers/itemController");

const { protect } = require("../middleware/authMiddleware");

// Create Item
router.post("/", protect, createItem);

// Get All Items
router.get("/", getItems);

// Get Single Item
router.get("/:id", getItem);

// Update Item
router.put("/:id", protect, updateItem);

// Delete Item
router.delete("/:id", protect, deleteItem);

module.exports = router;
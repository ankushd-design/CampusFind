const express = require("express");

const router = express.Router();

const {
  createClaim,
  getMyClaims,
  getReceivedClaims,
  acceptClaim,
  rejectClaim,
} = require("../controllers/claimController");

const { protect } = require("../middleware/authMiddleware");

// Create Claim
router.post("/", protect, createClaim);

// My Submitted Claims
router.get("/my", protect, getMyClaims);

// Claims Received On My Items
router.get("/received", protect, getReceivedClaims);

// Accept Claim
router.put("/accept/:id", protect, acceptClaim);

// Reject Claim
router.put("/reject/:id", protect, rejectClaim);

module.exports = router;
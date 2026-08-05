const Claim = require("../models/Claim");
const Item = require("../models/Item");

// =======================================
// Create Claim Request
// =======================================
exports.createClaim = async (req, res) => {
  try {
    const { itemId } = req.body;

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Prevent claims on closed/claimed items
    if (item.status !== "Open") {
      return res.status(400).json({
        success: false,
        message: "This item is no longer available for claiming.",
      });
    }

    // Prevent owner from claiming own item
    if (item.postedBy.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot claim your own item.",
      });
    }

    // Prevent duplicate claims
    const existingClaim = await Claim.findOne({
      item: itemId,
      claimant: req.user.id,
    });

    if (existingClaim) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted a claim.",
      });
    }

    const claim = await Claim.create({
      item: itemId,
      claimant: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Claim request submitted successfully.",
      claim,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =======================================
// Get My Claims
// =======================================
exports.getMyClaims = async (req, res) => {
  try {
    const claims = await Claim.find({
      claimant: req.user.id,
    })
      .populate("item")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: claims.length,
      claims,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =======================================
// Get Claims Received On My Items
// =======================================
exports.getReceivedClaims = async (req, res) => {
  try {
    const claims = await Claim.find()
      .populate({
        path: "item",
        match: {
          postedBy: req.user.id,
        },
      })
      .populate("claimant", "name email")
      .sort({ createdAt: -1 });

    const filteredClaims = claims.filter((claim) => claim.item);

    res.status(200).json({
      success: true,
      count: filteredClaims.length,
      claims: filteredClaims,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =======================================
// Accept Claim
// =======================================
exports.acceptClaim = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id).populate("item");

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim not found",
      });
    }

    // Only owner can accept
    if (claim.item.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Accept selected claim
    claim.status = "Accepted";
    await claim.save();

    // Mark item as claimed
    claim.item.status = "Claimed";
    await claim.item.save();

    // Reject all other pending claims
    await Claim.updateMany(
      {
        item: claim.item._id,
        _id: { $ne: claim._id },
        status: "Pending",
      },
      {
        status: "Rejected",
      }
    );

    res.status(200).json({
      success: true,
      message: "Claim accepted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =======================================
// Reject Claim
// =======================================
exports.rejectClaim = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id).populate("item");

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim not found",
      });
    }

    // Only owner can reject
    if (claim.item.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    claim.status = "Rejected";
    await claim.save();

    res.status(200).json({
      success: true,
      message: "Claim rejected successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
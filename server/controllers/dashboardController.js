const Item = require("../models/Item");
const Claim = require("../models/Claim");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalItems = await Item.countDocuments();

    const lostItems = await Item.countDocuments({
      type: "Lost",
    });

    const foundItems = await Item.countDocuments({
      type: "Found",
    });

    const claimedItems = await Item.countDocuments({
      status: "Claimed",
    });

    const myItems = await Item.countDocuments({
      postedBy: req.user.id,
    });

    const myClaims = await Claim.countDocuments({
      claimant: req.user.id,
    });

    res.status(200).json({
      success: true,
      stats: {
        totalItems,
        lostItems,
        foundItems,
        claimedItems,
        myItems,
        myClaims,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
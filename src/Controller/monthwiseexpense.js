const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { db } = require("../models/user");
const Transaction = require("../models/transaction");

router.get("/", async (req, res) => {
  try {
    const result = await Transaction.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$CreatedAt" },
          },
          totalAmount: { $sum: { $multiply: "$amount" } },
          count: { $sum: 1 },
        },
      },
    ]);
    return res.status(200).json({
      total: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});
module.exports = router;

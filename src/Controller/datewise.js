const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { db } = require("../models/user");
const Transaction = require("../models/transaction");

router.get("/", async (req, res) => {
  try {
    const result = await Transaction.aggregate([
      {
        $match: {
          CreatedAt: {
            $gte: new Date("2022-03-26"),  //date.now
            $lte: new Date("2022-03-27"),
          },
        },
      },
      {
        $group: {
          _id: { $dayOfYear: "$CreatedAt" },
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
      message: `the error is ${err}`
    });
  }
});
module.exports = router;

const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Transaction=require("../models/transaction");
router.post("/register", async (req, res) => {
    try {
      const emailExist = await User.findOne({ email: req.body.email });
      if (emailExist) return res.status(400).send("Email already exists");
  
      const salt =await bcrypt.genSalt(10);
      const hashedPassword=await bcrypt.hash(req.body.password,salt);
  
      
      const user = new User(
        { firstName:req.body.firstName,
          lastName:req.body.lastName,
          email:req.body.email,
          password:hashedPassword
        })
  
      const user1 = await user.save();
      res.json(user1);
    } catch (err) {
      res.status(400).send("error");
    }
  });
  router.post("/login", async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) return res.status(400).send("Email dose not exist");
      const validPass= await bcrypt.compare(req.body.password,user.password);
      if(!validPass) return res.status(400).send('Invalid Password');
  
      const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
      res.header("auth-token", token).send(token);
      res.send("Successfully Login ");
    } catch (err) {
      res.send("error");
    }
  });
router.get("/transactions", async (req, res) => {
    try {
        const transactions = await Transaction.find();
        return res.status(200).json({
          success: true,
          count: transactions.length,
          data: transactions,
        });
      } catch (err) {
        return res.status(500).json({
          success: false,
          error: "Server Error",
        });
      }
    });
  router.post("/transactions", async (req, res) => {
    try {
        const { text, amount } = req.body;
        const transaction = await Transaction.create(req.body);
        return res.status(201).json({
          success: true,
          data: transaction,
        });
      } catch (err) {
        if (err.name === "ValidationError") {
          const messages = Object.values(err.errors).map((val) => val.message);
          return res.status(400).json({
            success: false,
            error: messages,
          });
        } else {
          return res.status(500).json({
            success: false,
            error: "Server Error",
          });
        }
      }
    });
    router.put("/transactions/:id", async (req, res) => {
        try {
            const transaction = await Transaction.findById(req.params.id);
            transaction.text = req.body.text;
            transaction.amount = req.body.amount;
            const transaction1 = await transaction.save();
            return res.status(200).json({
              success: true,
              error: transaction1,
            });
          } catch (err) {
            return res.status(500).json({
              success: false,
              error: "Server Error",
            });
          }
        });
        
        
  router.delete("transactions/:id", async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
          return res.status(404).json({
            success: false,
            error: "No transaction found",
          });
        }
        await transaction.remove();
        return res.status(200).json({
          success: true,
          data: {},
        });
      } catch (err) {
        return res.status(500).json({
          success: false,
          error: "Server Error",
        });
      }
    });
module.exports=router;
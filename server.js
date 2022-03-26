const express = require("express");
const dotenv = require("dotenv");
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const postRoute=require('../src/routes/posts');
const limitRoute=require('./controllers/limitation');
const MonthExpense=require("../src/controllers/monthwiseexpense");
const DateWise=require("../src/controllers/datewise");
const auth=require("../src/routes/verifyToken");
// const transactions = require("./routes/transactions");
const userRouter = require("../src/routes/users");
const User=require("../src/models/user");
const PORT = 3000;
const mongoose = require("mongoose");
const url = "mongodb://localhost/ExpenseManager";
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const con = mongoose.connection;
con.on("open", () => {
  console.log("connected...");
});

app.use(express.json());

dotenv.config();
app.get("/", (req, res) => {
  res.send("Hello");
});
app.use("/users", userRouter);
app.use('/posts',postRoute);
app.use("/limit",limitRoute);
// app.use("/transactions", transactions);
app.use("/monthwise",MonthExpense);
app.use("/datewise",DateWise);
app.listen(PORT, (req, res) => {
  console.log(`now server is running on ${PORT}`);
});

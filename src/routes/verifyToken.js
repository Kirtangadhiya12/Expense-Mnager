const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  //Authorization: 'Bearer TOKEN'
  if (!token) {
    res.status(200).json("Token was not provided");
  }
  //Decoding the token
  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
  req.user = decodedToken;
  next();
};
module.exports = auth;
const express = require("express");
const router = express.Router();
const Verify = require("./verifyToken");
router.get("/", Verify, (req, res) => {
  res.json(
  { firstName,Lastname,email}=req.body
        
  );
});
module.exports = router;

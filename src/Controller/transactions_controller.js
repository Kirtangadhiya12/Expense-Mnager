const Transaction = require("../models/transaction");
const validator = require('validator');

//@desc get all transactions
//@route Get /transactions
//@access Public

exports.getTransactions = async (req, res) => {
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
};

//@desc add transaction
//@route POST /transactions
//@access Public

exports.addTransaction = async (req, res) => {
  try {
    const { text, amount } = req.body;
    const transaction = await Transaction.create(req.body);
    return res.status(201).json({
      success: true,
      data: transaction,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: "Server Error"
      });
    }
  }
};
//@desc Update transaction
//@route PUSH /transactions/:id
//@access Public

exports.updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        transaction.text = req.body.text;
        transaction.amount=req.body.amount;
        const transaction1 = await transaction.save();
        return res.status(400).json({
            success: true,
            error: transaction1
          });
      } catch (err) {
        return res.status(500).json({
            success: false,
            error: "Server Error",
      });
}
}

//@desc Delete transaction
//@route DELETE /transactions/:id
//@access Public

exports.deleteTransaction = async (req, res) => {
  try{
const transaction = await Transaction.findById(req.params.id);
if(!transaction){
    return res.status(404).json({
        success:false,
        error:'No transaction found'
    });
}
await transaction.remove();
return res.status(200).json({
    success:true,
    data:{}
});
  }catch(err){
    return res.status(500).json({
        success: false,
        error: "Server Error",
      });
  }
}
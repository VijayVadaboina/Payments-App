const express = require("express");
const { Account } = require("../db");
const authMiddleware = require("./middleware");
const { default: mongoose } = require("mongoose");

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
  const acc = await Account.findOne({
    user: req.userId,
  });
  res.json({
    balance: acc.balance,
  });
});

router.post("/transfer", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const { amount, toAccount } = req.body;
  const account = await Account.findOne({ userid: req.userid }).session(
    session
  );
  if (!account || account.balance < amount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Insufficient funds",
    });
  }

  const toUser = await Account.findOne({ userId: toAccount }).session(session);
  if (!toUser) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Invalid to account",
    });
  }
  await Account.updateOne(
    { userId: req.userId },
    { $inc: { balance: -amount } }
  ).session(session);
  await Account.updateOne(
    { userId: toAccount },
    { $inc: { balance: amount } }
  ).session(session);
  await session.commitTransaction();
  res.json({
    message: "Transfer Successful",
  });
});

module.exports = router;

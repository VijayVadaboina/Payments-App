const express = require("express");
const router = express.Router();

router.get("/balance", (req, res) => {
  res.json({
    message: "getting the balance",
  });
});
router.post("/transfer", (req, res) => {
  res.json({
    message: "transfer the funds",
  });
});

module.exports = router;

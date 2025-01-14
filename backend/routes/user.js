const express = require("express");
const router = express.Router();

router.post("/signup", (req, res) => {
  res.json({
    message: "signup successful",
  });
});
router.get("/signin", (req, res) => {
  res.json({
    message: "sign in successful",
  });
});

router.get("/search", (req, res) => {
  res.json({
    message: "searchin op",
  });
});
module.exports = router;

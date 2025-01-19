const express = require("express");
const router = express.Router();
const zod = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../db").User;
const Account = require("../db").Account;
const authMiddleware = require("./middleware");

const jwtsecret = process.env.JWT_SECRET;
function generateAccountNumber() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let accountNumber = "";
  for (let i = 0; i < 10; i++) {
    accountNumber += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return accountNumber;
}
//zod validation
const signupBody = zod.object({
  username: zod.string(),
  password: zod.string(),
  firstname: zod.string(),
  lastname: zod.string(),
});

router.post("/signup", async (req, res) => {
  const body = req.body;

  const { success } = signupBody.safeParse(body);
  if (!success) {
    res.status(411).json({
      message: "username already taken or incorrect input",
    });
  }
  const existingUser = await User.findOne({
    username: body.username,
  });
  if (existingUser) {
    res.status(411).json({
      message: "user already existed in the db",
    });
  }
  const userPassword = body.password;
  const saltRounds = 10;
  let hashedPassword;
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    hashedPassword = await bcrypt.hash(userPassword, salt);
  } catch (e) {
    res.status(411).json({
      message: "Error while generating salt",
    });
  }
  const user = await User.create({
    username: body.username,
    password: hashedPassword,
    firstname: body.firstname,
    lastname: body.lastname,
  });
  //const userId = user._id;

  await Account.create({
    accountNumber: generateAccountNumber(),
    balance: 1 + Math.random() * 10000,
    user: user._id,
  });
  const userId = user._id;
  const jwtsecret = process.env.JWT_SECRET;
  const token = jwt.sign({ userId }, jwtsecret);
  res.json({
    message: " signup endpoint",
    token: token,
  });
});

const signinBody = zod.object({
  username: zod.string(),
  password: zod.string(),
});

router.post("/signin", async (req, res) => {
  const body = req.body;
  const userpwd = body.password;
  const { success } = signinBody.safeParse(body);
  if (!success) {
    res.status(411).json({
      message: "Incorrect inputs",
    });
  }
  const user = await User.findOne({
    username: body.username,
  });
  if (user) {
    const dbUserPwd = user.password;
    const isMatch = await bcrypt.compare(userpwd, dbUserPwd);
    const jwtsecret = process.env.JWT_SECRET;
    if (isMatch) {
      const token = jwt.sign({ userId: user._id }, jwtsecret);
      res.json({
        message: " signin endpoint",
        token: token,
      });
    }
  } else {
    res.status(411).json({
      message: " Username /password not matched",
    });
  }
});

const updateBody = zod.object({
  password: zod.string().optional(),
  firstname: zod.string().optional(),
  lastname: zod.string().optional(),
});
router.put("/update/:id", authMiddleware, async (req, res) => {
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    res.status(411).json({
      message: "Error while updating the info",
    });
  }
  try {
    const useridFromParam = req.params.id;
    const userToUpdate = await User.findByIdAndUpdate(
      useridFromParam,
      req.body,
      { new: true }
    );
    if (!userToUpdate) {
      return res.status(404).json({
        message: "user not found",
      });
    }
    res.json({
      message: " update successfully",
      updateduser: userToUpdate,
    });
  } catch (err) {
    res.status(500).json({
      message: "error while updating to server",
    });
  }
});

router.get("/search", async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstname,
      lastName: user.lastname,
      _id: user._id,
    })),
  });
});
module.exports = router;

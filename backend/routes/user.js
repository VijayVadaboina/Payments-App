const express = require("express");
const z = require("zod");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const router = express.Router();

//zod schema
const invalidTypeError = " This is not a valid type";
const requiredError = "This field cannot be blank";
const signupSchema = z.object({
  username: z
    .string({
      invalid_type_error: invalidTypeError,
      required_error: requiredError,
    })
    .min(1, { message: requiredError }),
  password: z
    .string({
      invalid_type_error: invalidTypeError,
      required_error: requiredError,
    })
    .min(4)
    .nonempty(),
  firstname: z
    .string({
      invalid_type_error: invalidTypeError,
      required_error: requiredError,
    })
    .max(50)
    .nonempty(),
  lastname: z
    .string({
      invalid_type_error: invalidTypeError,
      required_error: requiredError,
    })
    .max(50)
    .nonempty(),
});

//POST - /signup
router.post("/signup", async (req, res) => {
  const body = req.body;
  const { success } = signupSchema.safeParse(body);
  if (!success) {
    return res.status(411).json({
      message: "Invalid body format",
      errors: success.error.details,
    });
  }
  const existingUser = await User.findOne({
    username: body.username,
  });
  if (existingUser._id) {
    return res.status(411).json({
      message: "Username already exists",
    });
  }

  const createdUser = await User.Create(body);
  const jwtToken = jwt.sign({ userId: createdUser._id }, jwtSecret);
  return res.status(200).json({
    message: "user created successfully",
    token: jwtToken,
  });
});

router.post("/signin", (req, res) => {
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

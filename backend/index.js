const express = require("express");
const userRouter = require("./routes/index");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
app.use(cors);
app.use(express.json());
app.use("/api/v1", userRouter);

app.listen(port, () => {
  console.log(`server started on port {port}`);
});

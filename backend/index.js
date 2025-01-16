const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const userRouter = require("./routes/index");
const User = require("./db");
const app = express();

dotenv.config();

app.use(cors);
app.use(express.json());
app.use("/api/v1", userRouter);

const mongourl = process.env.MONGO_URI;
const port = process.env.PORT || 5000;

mongoose
  .connect(mongourl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to mongo db successfully");
  })
  .catch((err) => console.error(" Mongo DB Error :", err));

app.listen(port, () => {
  console.log(`server started on port ${port}`);
  console.log(mongourl);
});

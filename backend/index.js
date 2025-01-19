const express = require("express");
const rootRouter = require("./routes/index");
const cors = require("cors");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

app.use("/api/v1", rootRouter);

const port = process.env.PORT;
console.log("portfrom env  : ", port);
const conn_url = process.env.MONGO_URI;
console.log("url from env", conn_url);
mongoose
  .connect(conn_url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("connected to db successfully");
  })
  .catch((err) => {
    console.error(console.error("Mongo DB connection error : ", err));
  });

app.listen(port, () => {
  console.log(port);
  console.log("server running on port 3000");
});

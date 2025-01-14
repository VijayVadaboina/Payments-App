const express = require("express");
const userRouter = require("./routes/index");

const app = express();
app.use(express.json());
app.use("/api/v1", userRouter);

app.listen(3000, () => {
  console.log(" server started on port 3000");
});

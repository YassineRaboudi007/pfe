require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

//Routers
const UserRouter = require("./routes/UserRoutes");
const CompanyRouter = require("./routes/CompanyRouter");

mongoose.connect("mongodb://localhost:27017/PfeDB");

app.use(cors());
app.use(express.json());

app.use("/user", UserRouter);
app.use("/company", CompanyRouter);

app.listen(4000, () => {
  console.log("Server is running");
});

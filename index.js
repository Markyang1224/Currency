const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const path = require("path");
const Home = require("./controllers/HomeController");
const CalculatorRoute = require("./routes/calculator");

mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => {
    console.log("Connect to MongoDB Atalas");
  })
  .catch((err) => {
    console.log("Connect Unsuccessful");
  });

/////////////////middleware////////////////////

app.set("view engine", "ejs");
//static file
app.use(express.static(path.join(__dirname, "public")));
//req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/calculator", CalculatorRoute);
//////////////////endpoint//////////////////

app.get("/", Home.index);

app.post("/", Home.formsubmit);

app.listen(3000, (req, res) => {
  console.log("Server is listening on port 3000");
});

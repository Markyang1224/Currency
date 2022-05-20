const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const path = require("path");
const Home = require("./controllers/HomeController");
const Calculator = require("./controllers/CalculatorController");

/////////////////middleware////////////////////

app.set("view engine", "ejs");
//static file
app.use(express.static(path.join(__dirname, "public")));
//req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//////////////////endpoint//////////////////

app.get("/", Home.index);

app.post("/", Home.formsubmit);

app.get("/calculator", Calculator.index);
app.listen(3000, (req, res) => {
  console.log("Server is listening on port 3000");
});

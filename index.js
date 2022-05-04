const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");

//middleware

app.set("view engine", "ejs");

//req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//endpoint

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(3000, (req, res) => {
  console.log("Server is listening on port 3000");
});

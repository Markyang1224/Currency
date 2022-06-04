const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const Home = require("./controllers/HomeController");
const Calculator = require("./routes/calculator");
const Auth = require("./routes/auth_route");
const Member = require("./routes/member");

require("./config/passport");

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

//session 設定
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/calculator", Calculator);
app.use("/auth", Auth);
app.use("/member", Member);
//////////////////endpoint//////////////////

app.get("/", Home.index);

app.post("/", Home.formsubmit);

app.listen(3000, (req, res) => {
  console.log("Server is listening on port 3000");
});

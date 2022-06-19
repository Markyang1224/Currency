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
const flash = require("connect-flash");

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

//設定flash  ,locals為一個物件 可自訂一些訊息在裡面
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  //passport 專用
  res.locals.error = req.flash("error");
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use("/calculator", Calculator);
app.use("/auth", Auth);
app.use("/member", Member);
//////////////////endpoint//////////////////

app.get("/", Home.index);

app.post("/", Home.formsubmit);

app.post("/collect", Home.collect);

app.listen(3000, (req, res) => {
  console.log("Server is listening on port 3000");
});

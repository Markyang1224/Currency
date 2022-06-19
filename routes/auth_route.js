const router = require("express").Router();
const passport = require("passport");
const AuthController = require("../controllers/AuthController");
const User = require("../models/user_model");
const bcrypt = require("bcrypt");

//Google login

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/redirect",
  passport.authenticate("google"),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

router.get("/login", AuthController.login);

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
    failureFlash: "Wrong email or password",
  }),
  (req, res) => {
    res.redirect("/");
  }
);

router.get("/signup", AuthController.signup);

router.post("/signup", async (req, res) => {
  console.log(req.body);
  let { name, email, password } = req.body;
  //check if the data is already exist
  const emailExist = await User.findOne({ email });
  if (emailExist) {
    req.flash("error_msg", "Email has already been registered");
    res.redirect("/auth/signup");
  }

  //對password加密, 並存進database
  const hash = await bcrypt.hash(password, 10);
  password = hash;
  let newUser = new User({ name, email, password });

  try {
    const saveUser = await newUser.save();
    req.flash("success_msg", "Registration succeeds. You can login now.");
    res.redirect("/auth/login");
  } catch (err) {
    console.log(err);
    console.log(err.errors.name.properties);
    req.flash("error_msg", err.errors.name.properties.message);
    res.redirect("/auth/signup");
  }
});

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});
module.exports = router;

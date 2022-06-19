const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/user_model");

const login = (req, res) => {
  res.render("login", { user: req.user });
};

const signup = (req, res) => {
  res.render("signup", { user: req.user });
};

module.exports = { login, signup };

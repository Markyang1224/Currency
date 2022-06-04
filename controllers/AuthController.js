const login = (req, res) => {
  res.render("login", { user: req.user });
};

const signup = (req, res) => {
  res.render("signup");
};

module.exports = { login, signup };

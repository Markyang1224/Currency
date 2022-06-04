const index = (req, res) => {
  res.render("member", { user: req.user });
};

module.exports = { index };

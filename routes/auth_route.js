const router = require("express").Router();
const passport = require("passport");
const AuthController = require("../controllers/AuthController");

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

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});
router.get("/login", AuthController.login);

router.get("/signup", AuthController.signup);

module.exports = router;

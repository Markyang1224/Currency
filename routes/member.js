const router = require("express").Router();
const MemberController = require("../controllers/MemberController");

router.get("/", MemberController.index);

module.exports = router;

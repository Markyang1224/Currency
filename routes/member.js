const router = require("express").Router();
const MemberController = require("../controllers/MemberController");

router.get("/", MemberController.index);
router.get("/collection/:currency_id", MemberController.changecurrency);
router.get("/collection/:currency_id/chart", MemberController.chartchange);

module.exports = router;

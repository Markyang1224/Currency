const router = require("express").Router();
const calculator = require("../controllers/CalculatorController");

router.get("/", calculator.index);

router.post("/", calculator.calculate);

module.exports = router;

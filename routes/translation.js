const express = require("express");
const router = express.Router();

const TranslationController = require("../controllers/translation");

router.post("/", TranslationController.translate);

module.exports = router;

const express = require("express");
const router = express.Router();

const TranslationController = require("../controllers/translation");

const { validateTranslationInputs } = require("../middleware");

router.post("/", validateTranslationInputs, TranslationController.translate);

module.exports = router;

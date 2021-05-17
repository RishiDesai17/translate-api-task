exports.translationBaseURL = "https://api.cognitive.microsofttranslator.com";
exports.translationServiceLocation =
    process.env.NODE_ENV === "development" ? "centralindia" : "eastus";

// related languages by region to use during smart pre-caching
exports.regions = {
    "south-asian": new Set(["hi", "gu", "bn", "kn", "ta"]),
    "european": new Set(["en", "fr", "es", "nl", "de"]),
};

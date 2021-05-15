const { validLangCodes } = require("../constants/languageCodes");

exports.validateTranslationInputs = (req, res, next) => {
    try {
        const { text, sourceLang, targetLang } = req.body;
        if (!text || !sourceLang || !targetLang) {
            return res.status(400).json({
                statusText: "Bad Request",
                message: "Input fields incomplete",
            });
        }
        
        if(text.length > 200) {
            return res.status(400).json({
                statusText: "Bad Request",
                message: "Character limit of 200 characters on text exceeded",
            });
        }

        if(!validLangCodes.has(sourceLang) || !validLangCodes.has(targetLang)) {
            return res.status(400).json({
                statusText: "Bad Request",
                message: "Invalid language code",
            });
        }

        next();
    } catch (err) {
        return res.status(500).json({
            statusText: "Internal Server Error",
            message: "Something went wrong!",
        });
    }
};

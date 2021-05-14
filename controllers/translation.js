const { translate } = require("../services/translation");
const { executeQuery } = require("../db");

exports.translate = async (req, res) => {
    try {
        const { text, sourceLang, targetLang } = req.body;
        if (!text || !sourceLang || !targetLang) {
            return res.status(400).send("Input fields incomplete");
        }

        // This join will return a row only if both the original text 
        // and its required translation for user requested language is found
        const rows = await executeQuery(
            `SELECT translation.translatedtext FROM original 
            INNER JOIN translation 
            ON original.id = translation.originaltextid
            WHERE original.originaltext = ? AND original.lang = ? AND translation.lang = ?`,
            [text, sourceLang, targetLang]
        );

        // check if required translation was found in cache
        if (rows.length > 0) {
            return res.status(200).json({
                text: rows[0].translatedtext,
                to: targetLang,
            });
        }

        // Translation API which will be used when translation not found in cache
        const translation = await translate(text, sourceLang, targetLang);

        if (translation.error) {
            const { status, statusText, message } = translation.error;
            return res.status(status).json({
                statusText,
                message,
            });
        }

        res.status(200).json(translation);
    } catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong!");
    }
};

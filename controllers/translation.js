const { translate } = require("../services/translation");

exports.translate = async (req, res) => {
    try {
        const { text, sourceLang, targetLang } = req.body;
        if (!text || !sourceLang || !targetLang) {
            return res.status(400).send("Input fields incomplete");
        }

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

const axios = require("axios");
const {
    translationBaseURL,
    translationServiceLocation,
} = require("../constants");

exports.translate = async (text, sourceLang, targetLang) => {
    try {
        const response = await axios({
            baseURL: translationBaseURL,
            url: "/translate",
            method: "post",
            headers: {
                "Ocp-Apim-Subscription-Key": process.env.SUBSCRIPTION_KEY,
                "Ocp-Apim-Subscription-Region": translationServiceLocation,
                "Content-type": "application/json",
            },
            params: {
                "api-version": "3.0",
                from: sourceLang,
                to: targetLang,
            },
            data: [
                {
                    text,
                },
            ],
            responseType: "json",
        });

        return response.data[0].translations[0];
    } catch (error) {
        console.error(error);
        if (error.response) {
            const { status, statusText, data } = error.response;
            return {
                error: {
                    status,
                    statusText,
                    message: data.error.message,
                },
            };
        }
        return {
            error: {
                status: 500,
                statusText: "Internal Server Error",
                message: "Something went wrong!",
            },
        };
    }
};

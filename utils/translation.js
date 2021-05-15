const { regions } = require("../constants");
const { translate } = require("../services/translation");
const { pool, executeQuery } = require("../db");

exports.cacheTranslationsToDB = async (
    originalText,
    sourceLang,
    translatedText,
    targetLang
) => {
    let connection;
    try {
        // We use IGNORE keyword, so that if word is already present in db,
        // an error is not thrown(new row is not inserted irrespective of using IGNORE or not),
        // and we can handle the next step in the try block itself
        const originalTextValues = await executeQuery(
            "INSERT IGNORE INTO original(originaltext, lang) VALUES(?, ?)",
            [originalText, sourceLang]
        );

        let foreignKey;
        // If affectedRows was 0 means that the word is already present in the db,
        // so we need to fetch its id to be used as a foreign key
        if (originalTextValues.affectedRows === 0) {
            const response = await executeQuery(
                "SELECT id FROM original WHERE originaltext = ? AND lang = ?",
                [originalText, sourceLang]
            );
            foreignKey = response[0].id
        } else {
            foreignKey = originalTextValues.insertId;
        }

        // check if this languages has common languages for pre-caching
        let regionFound;
        for (region of Object.keys(regions)) {
            if (regions[region].has(targetLang)) {
                regionFound = region;
            }
        }

        const sqlQuery =
            "INSERT INTO translation(translatedtext, lang, originaltextid) VALUES(?, ?, ?)";

        connection = await pool.getConnection();

        // We make use of transaction, so that we can rollback if a problem occurs
        await connection.beginTransaction();

        let languages = [];
        // If region was found in our list of related languages,
        // we need to store translations for them too for smart pre-caching.
        // else we just enter the current language in the array
        if (regionFound) {
            languages = [...regions[regionFound]];
        } else {
            languages.push(targetLang);
        }

        await Promise.all(
            languages.map(async (language) => {
                // The source lang is also part of the languages array, so we do not deal with it.
                if (language !== sourceLang) {
                    if (language === targetLang) {
                        // For target language requested, we have already fetched its translation
                        await connection.query(sqlQuery, [
                            translatedText,
                            language,
                            foreignKey,
                        ]);
                    } else {
                        // Fetch translation for pre-caching
                        const translation = await translate(
                            originalText,
                            sourceLang,
                            language
                        );
                        await connection.query(sqlQuery, [
                            translation.text,
                            language,
                            foreignKey,
                        ]);
                    }
                }
            })
        );

        await connection.commit();
    } catch (error) {
        console.error(error);
        await connection.rollback();
    } finally {
        connection.release();
    }
};

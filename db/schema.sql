CREATE TABLE IF NOT EXISTS original (
    id INT PRIMARY KEY auto_increment,
    originaltext VARCHAR(200) NOT NULL,
    lang VARCHAR(2) NOT NULL,
    UNIQUE INDEX originaltext_lang (originaltext, lang)
);

CREATE TABLE IF NOT EXISTS translation (
    id INT PRIMARY KEY auto_increment,
    translatedtext VARCHAR(200) NOT NULL,
    lang VARCHAR(2) NOT NULL,
    originaltextid INT NOT NULL,
    FOREIGN KEY (originaltextid) REFERENCES original(id),
    UNIQUE INDEX fk_targetlang (originaltextid, lang)
);
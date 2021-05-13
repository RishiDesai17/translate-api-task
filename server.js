const express = require("express");
require("dotenv").config({ path: __dirname + "/.env" });
const { executeQuery } = require("./db");
const fs = require("fs").promises;

const translationRoutes = require("./routes/translation");

const app = express();
app.use(express.json());

app.use("/api/translate", translationRoutes);

const init = async () => {
    try {
        let queries = await fs.readFile("./db/schema.sql", "utf-8");
        queries = queries.replace(/\r|\n/g, "").split(";");
        queries.pop();

        await Promise.all(
            queries.map(async (query) => {
                await executeQuery(query);
            })
        );
    } catch (error) {
        console.log(error);
    }
};

const port = 3001;
init().then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});

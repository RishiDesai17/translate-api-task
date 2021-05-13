const express = require("express");
require("dotenv").config({ path: __dirname + "/.env" });

const translationRoutes = require("./routes/translation");

const app = express();
app.use(express.json());

app.use("/api/translate", translationRoutes);

const port = 3001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

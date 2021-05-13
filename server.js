const express = require("express");
require("dotenv").config({ path: __dirname + "/.env" });

const app = express();
app.use(express.json());

const port = 3001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

const express = require("express");
const app = express();
const port = 4000;

app.use(express.static("static"));

app.listen(port, () => console.log(`Czech civil war bot is running on http://localhost:${port}!`));

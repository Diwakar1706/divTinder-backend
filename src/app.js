const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("Hello from server main! 👋");
});

app.get("/hello", (req, res) => {
    res.send("Hello from server hello! 👋");
});

app.get("/test", (req, res) => {
    res.send("Hello from server test! 👋");
});

app.get("/code", (req, res) => {
    res.send("Hello from server code! 👋");
});

app.listen(8001, () => {
    console.log("✅ Server is successfully listening on port 8001");
});
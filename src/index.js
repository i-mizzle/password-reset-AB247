const express = require('express');
require('dotenv').config()

let connect = require('./db/connect');
let routes = require('./routes');

const port = process.env.PORT;
const host = process.env.HOST;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
const server = app.listen(port, () => {
    console.log(`server is listening at http://${host}:${port}`);
    connect();
    routes(app);
});

module.exports = server
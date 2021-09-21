var express = require("express");
var app = express();
var router = require("./router");
var constants = require("./constants");
var cors = require("cors");

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(process.env.PORT || constants.root_url_port);
console.log("Started listening at port " + (process.env.PORT || constants.root_url_port));
router.route(app);

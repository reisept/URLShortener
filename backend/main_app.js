var express = require("express");
var app = express();
var router = require("./router");
var constants = require("./constants");
var cors = require("cors");

app.use(cors());
app.use(express.bodyParser());
app.use(express.urlencoded());
app.use(express.json());

app.listen(constants.root_url_port);
console.log("Started listening at port " + constants.root_url_port);
router.route(app);

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { ROUTES } = require("./registerRoutes");
const cors = require("cors");

var app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  process.env.STATIC_PREFIX,
  express.static(path.join(__dirname, "static"))
);

for (let index = 0; index < ROUTES.length; index++) {
  const route = ROUTES[index];
  app.use(process.env.ROUTE_PREFIX + route.uri, require(route.path));
}

module.exports = app;

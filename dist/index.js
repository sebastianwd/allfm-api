"use strict";

require("dotenv/config");

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _graphqlPlaygroundMiddlewareExpress = _interopRequireDefault(require("graphql-playground-middleware-express"));

var _expressGraphql = _interopRequireDefault(require("express-graphql"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
var PORT = process.env.PORT || 3000;
app.use("/graphql", (0, _cors["default"])(), _bodyParser["default"].json(), (0, _expressGraphql["default"])({
  schema: null,
  graphiql: false
}));
app.get("/playground", (0, _graphqlPlaygroundMiddlewareExpress["default"])({
  endpoint: "/graphql"
}));
app.listen(PORT, function () {
  return console.log("Server listening on port ".concat(PORT, "..."));
});
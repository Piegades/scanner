"use strict";

module.exports = {
  name: "rest-api",
  version: "0.0.1",
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 4000,
  acceptable: ["application/json"],
  strictRouting: true,
  db: {
    uri: "mongodb://localhost:27017/data"
  }
};

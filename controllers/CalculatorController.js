const axios = require("axios");
const cheerio = require("cheerio");
const res = require("express/lib/response");

const index = (req, res) => {
  res.render("calculator");
};

module.exports = { index };

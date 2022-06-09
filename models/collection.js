const mongoose = require("mongoose");

const collectionschema = new mongoose.Schema({
  email: {
    type: String,
  },
  currency_name: {
    type: String,
  },
  currency_id: {
    type: String,
  },
});

module.exports = mongoose.model("Collection", collectionschema);

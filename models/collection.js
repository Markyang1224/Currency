const mongoose = require("mongoose");

const collectionschema = new mongoose.Schema({
  user_id: {
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

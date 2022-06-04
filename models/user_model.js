const mongoose = require("mongoose");

const userschema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minlength: 3,
    maxlength: 255,
  },

  googleID: {
    type: String,
  },

  date: {
    type: String,
  },

  thumbnail: {
    type: String,
  },

  email: {
    type: String,
  },

  password: {
    type: String,
    minlength: 8,
    maxlength: 1024,
  },
});

module.exports = mongoose.model("User", userschema);

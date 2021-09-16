const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const urlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: mongoose.SchemaTypes.String,
    default: () => nanoid(),
  },
});

module.exports = mongoose.model("Url", urlSchema);

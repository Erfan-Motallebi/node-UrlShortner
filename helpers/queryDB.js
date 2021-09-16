const { nanoid } = require("nanoid/async");
const Url = require("../models/url.model");
module.exports = class QueryHelper {
  static async findUrl(url) {
    const urlPicked = await Url.findOne({ url: { $eq: url } });
    if (!urlPicked) return await nanoid();
    return urlPicked.shortUrl;
  }
};

const express = require("express");
const createHttpError = require("http-errors");
const { nanoid } = require("nanoid/async");
const path = require("path");
const DB = require("./helpers/db");
const Url = require("./models/url.model");

// ! Database
DB.DBConnect();

const app = express();

app.set("view engine", "ejs");
app.set("engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

// http://www.google.com

app.post("/", async (req, res, next) => {
  const { url } = req.body;
  req.acceptedUrl = url;
  try {
    if (!url)
      throw createHttpError.BadRequest(
        "Url is required. please try again later"
      );
    const urlCheck = await Url.findOne({ url: { $eq: url } });
    if (urlCheck) {
      return res
        .status(201)
        .render("index", { url, shortUrl: urlCheck.shortUrl });
    }
    const newUrl = await Url.create({
      url,
      shortUrl: `${req.headers["host"]}/` + `${await nanoid()}`,
    });
    const urlSaved = await newUrl.save();
    res.status(200).render("index", { url, shortUrl: urlSaved.shortUrl });
    return;
  } catch (error) {
    next(error);
  }
});

// app.get("/:shortUrl", (req, res, next) => {
//   const { shortUrl } = req.params;
//   try {
//     if (!shortUrl) throw createHttpError.NotFound("Url Not available");
//     res.redirect(req.acceptedUrl);
//   } catch (error) {
//     next(error);
//   }
// });

app.all("*", (req, res, next) => {
  next(createHttpError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(res.statusCode || 500).render("index", { err });
});

app.listen(5555, () => {
  console.log("listening on port 5555");
});

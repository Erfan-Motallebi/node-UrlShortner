const express = require("express");
const createHttpError = require("http-errors");
const path = require("path");
const DB = require("./helpers/db");
const QueryHelper = require("./helpers/queryDB");
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
  try {
    if (!url)
      throw createHttpError.BadRequest(
        "Url is required. please try again later"
      );
    const shortUrl = await QueryHelper.findUrl(url);
    res
      .status(200)
      .render("index", { url, shortUrl: `${req.headers["host"]}/${shortUrl}` });
  } catch (error) {
    next(error);
  }
});

// app.get("/:shortUrl", (req, res, next) => {
//   const { shortUrl } = req.params;
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

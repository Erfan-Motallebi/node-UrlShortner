const { connect, connection } = require("mongoose");

module.exports = class DB {
  static _DBPort = 27017;
  static _DBHost = "mongodb://localhost";
  static _DBName = "urlShortner";

  static DBConnect() {
    connect(`${this._DBHost}:${this._DBPort}`, {
      dbName: this._DBName,
    });
    connection
      .on("open", () => {
        console.info("DB is connected now");
      })
      .on("error", (err) => {
        console.error("DB failed to connect");
      })
      .on("disconnected", () => {
        console.log("DB is disconnected");
      })
      .on("close", () => {
        console.info("DB is closed");
      });
    process.on("SIGINT", async () => {
      await connection.close();
    });
  }
};

"use strict";

module.exports.register = (app, database) => {
  app.get("/", async (req, res) => {
    res.status(200).send("This is running!").end();
  });

  app.get("/api/users", async (req, res) => {
    let query;
    query = database.query("SELECT * FROM Users");

    const records = await query;

    res.status(200).send(JSON.stringify(records)).end();
  });
};

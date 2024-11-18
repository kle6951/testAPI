"use strict";

module.exports.register = (app, database) => {
  app.get("/", async (req, res) => {
    res.status(200).send("This is running!").end();
  });

  app.get("/api/categories", async (req, res) => {
    try {
      let query;
      query = database.query("SELECT * FROM Categories");
      const records = await query;
      res.status(200).send(JSON.stringify(records)).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

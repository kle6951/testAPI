"use strict";
const bcrypt = require("bcryptjs");
const saltLevel = 10; // sercurity level
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

  app.post("/api/users", async (req, res) => {
    const { id, full_name, email, password } = req.body;
    if (!id || !full_name || !email || !password) {
      return res.status(400).send({ error: "All fields are required." });
    }
    try {
      const hashedPassword = await bcrypt.hash(password, saltLevel);
      const query = `INSERT INTO Users (id, full_name, email, password, created_at) VALUES (?, ?, ?, ?, NOW())`;
      const result = await database.query(query, [
        id,
        full_name,
        email,
        hashedPassword,
      ]);
      res
        .status(201)
        .send({ message: "User created successfully", id: result.insertId });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).send({ error: "Failed to create user" });
    }
  });
};

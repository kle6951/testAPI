"use strict";

module.exports.register = (app, database) => {
  app.get("/", async (req, res) => {
    res.status(200).send("This is running!").end();
  });

  // GET
  app.get("/api/roomateListings", async (req, res) => {
    let query;
    query = database.query("SELECT * FROM RoomateListings");

    const records = await query;

    res.status(200).send(JSON.stringify(records)).end();
  });

  // POST
  app.post("/api/roomateListings", async (req, res) => {
    try {
      const {
        title,
        price,
        description,
        category_id,
        user_id,
        images,
        location,
      } = req.body;

      // Ensure required fields are present
      if (!title || !price || !category_id || !user_id || !images) {
        return res.status(400).send("Missing required fields").end();
      }

      const query = `
        INSERT INTO RoomateListings (title, price, description, category_id, user_id, images, location)
        VALUES (?, ?, ?, ?, ?,?,?)
      `;

      const result = await database.query(query, [
        title,
        price,
        description,
        category_id,
        user_id,
        images,
        location,
      ]);
      res
        .status(201)
        .send({ message: "Listing created successfully", id: result.insertId })
        .end();
    } catch (error) {
      console.error("Error creating listing:", error.message);
      res.status(500).send("Error creating listing").end();
    }
  });
};

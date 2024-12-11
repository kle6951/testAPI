"use strict";

module.exports.register = (app, database) => {
  app.get("/", async (req, res) => {
    res.status(200).send("This is running!").end();
  });

  // GET
  app.get("/api/roomateListings", async (req, res) => {
    try {
      const query = `
        SELECT 
          RoomateListings.*, 
          Users.full_name AS user_name, 
          Users.email AS user_email, 
          Users.avatar AS user_avatar,
          (SELECT COUNT(*) FROM RoomateListings AS rl WHERE rl.user_id = Users.id) AS user_listing_count
        FROM RoomateListings
        JOIN Users ON RoomateListings.user_id = Users.id
      `;

      const records = await database.query(query);

      res.status(200).send(JSON.stringify(records)).end();
    } catch (error) {
      console.error("Error fetching roomate listings:", error.message);
      res.status(500).send("Error fetching roomate listings").end();
    }
  });
  // GET roomate listings based on user_id
  app.get("/api/user/:id/roomateListings", async (req, res) => {
    const userId = req.params.id;
    const query = `
      SELECT 
        RoomateListings.*,
        Users.full_name AS user_name,
        Users.email AS user_email,
        Users.avatar AS user_avatar,
        (SELECT COUNT(*) FROM RoomateListings AS rl WHERE rl.user_id = Users.id) AS user_listing_count
      FROM RoomateListings
      JOIN Users ON RoomateListings.user_id = Users.id
      WHERE RoomateListings.user_id = ?;
    `;

    try {
      const records = await database.query(query, [userId]);
      res.status(200).send(JSON.stringify(records)).end();
    } catch (error) {
      console.error("Error fetching listings:", error.message);
      res.status(500).send("Error fetching listings").end();
    }
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

  // DELETE a roomate listing
  app.delete(
    "/api/user/:userId/roomateListings/:roomateListingId",
    async (req, res) => {
      const userId = req.params.userId;
      const listingId = req.params.listingId;

      const query = `
      DELETE FROM RoomateListings 
      WHERE id = ? AND user_id = ?;
    `;
      try {
        const result = await database.query(query, [listingId, userId]);

        // Check if any rows were affected
        if (result.affectedRows === 0) {
          return res
            .status(404)
            .send("Listing not found or not authorized to delete")
            .end();
        }
        res.status(200).send({ message: "Listing deleted successfully" }).end();
      } catch (error) {
        console.error("Error deleting listing:", error.message);
        res.status(500).send("Error deleting listing").end();
      }
    }
  );
};

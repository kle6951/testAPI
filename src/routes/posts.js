"use strict";
module.exports.register = (app, database) => {
  app.get("/", async (req, res) => {
    res.status(200).send("This is running!").end();
  });
  // GET
  app.get("/api/posts", async (req, res) => {
    try {
      const query = `
        SELECT 
          Posts.*,
          Users.full_name AS user_name,
          Users.avatar AS user_avatar
        FROM Posts
        JOIN Users ON Posts.user_id = Users.id
        `;
      const records = await database.query(query);

      res.status(200).send(JSON.stringify(records)).end();
    } catch (error) {
      console.error("Error fetching listings:", error.message);
      res.status(500).send("Error fetching listings").end();
    }
  });
  // POST
  app.post("/api/posts", async (req, res) => {
    try {
      const { caption, user_id, images } = req.body;
      if (!caption || !user_id || !images) {
        return res.status(400).send("Missing required fields").end();
      }
      const query = `
        INSERT INTO Posts (caption, user_id, images)
        VALUES (?,?,?)
      `;

      const result = await database.query(query, [caption, user_id, images]);
      res
        .status(201)
        .send({ message: "Posts created successfully", id: result.insertId })
        .end();
    } catch (error) {
      console.error("Error creating post:", error.message);
      res.status(500).send("Error creating post").end();
    }
  });
};

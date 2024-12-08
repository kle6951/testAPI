"use strict";
module.exports.register = (app, database) => {
  app.get("/", async (req, res) => {
    res.status(200).send("This is running!").end();
  });
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

      console.log(records);

      res.status(200).send(JSON.stringify(records)).end();
    } catch (error) {
      console.error("Error fetching listings:", error.message);
      res.status(500).send("Error fetching listings").end();
    }
  });
};

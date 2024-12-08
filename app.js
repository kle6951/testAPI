"use strict";

const express = require("express");
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.set("Content-Type", "application/json");
  next();
});

const startServer = async (_) => {
  const database = require("./src/database");
  let db = await database.setup();

  const listingsRoutes = require("./src/routes/listings");
  listingsRoutes.register(app, db);

  const roomateListings = require("./src/routes/roommateListings");
  roomateListings.register(app, db);

  const categoriesRoutes = require("./src/routes/catgories");
  categoriesRoutes.register(app, db);

  const usersRoutes = require("./src/routes/users");
  usersRoutes.register(app, db);

  const postsRoutes = require("./src/routes/posts");
  postsRoutes.register(app, db);

  const PORT = process.env.PORT || 8080;
  const server = app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log("Press Ctrl+C to quit.");
  });
  process.on("unhandledRejection", (err) => {
    console.error(err);
    throw err;
  });

  return server;
};

startServer();

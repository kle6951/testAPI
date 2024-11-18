const express = require("express");
const connectToDatabase = require("./database");
const listingsRoutes = require("./routes/listings");
const categoriesRoutes = require("./routes/categories");
const usersRoutes = require("./routes/users");

const app = express();
const PORT = process.env.PORT;

app.use(express.json()); // Middleware to parse JSON requests

(async () => {
  const database = await connectToDatabase();

  // Register routes
  listingsRoutes(app, database);
  categoriesRoutes(app, database);
  usersRoutes(app, database);

  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
})();

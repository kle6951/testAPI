const express = require("express");
const connectToDatabase = require("./src/database").setup;
const listingsRoutes = require("./src/routes/listings");
const categoriesRoutes = require("./src/routes/categories");
const usersRoutes = require("./src/routes/users");

const app = express();
app.use(express.json());

// Middleware to set content type as JSON for all responses
app.use((req, res, next) => {
  res.set("Content-Type", "application/json");
  next();
});

const startServer = async () => {
  try {
    // Connect to the database
    const database = await connectToDatabase();

    // Register routes by calling the register function
    listingsRoutes.register(app, database);
    categoriesRoutes.register(app, database); // Assuming similar export for categoriesRoutes
    usersRoutes.register(app, database); // Assuming similar export for usersRoutes

    const PORT = process.env.PORT; // Default to 3000 if no port is specified

    // Start the server and log the URL
    const server = app.listen(PORT, () => {
      console.log(`Server running on http://34.68.160.34:${PORT}`);
      console.log("Press Ctrl+C to quit.");
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      console.error(err);
      throw err;
    });

    return server;
  } catch (err) {
    console.error("Error starting the server:", err);
    process.exit(1);
  }
};

// Start the server
startServer();

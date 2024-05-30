// import required modules here
const express = require("express");
const sql = require("mssql");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

const staticMiddleware = express.static("public"); // Path to the public folder

// Include body-parser middleware to handle JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling

//bootstrap
app.use("/",express.static("./node_modules/bootstrap/dist/"));

app.use(staticMiddleware); // Mount the static middleware


// routes here


app.listen(port, async () => {
  // try {
  //   // Connect to the database
  //   await sql.connect(dbConfig);
  //   console.log("Database connection established successfully");
  // } catch (err) {
  //   console.error("Database connection error:", err);
  //   // Terminate the application with an error code (optional)
  //   process.exit(1); // Exit with code 1 indicating an error
  // }

  console.log(`Server listening on port ${port}`);
});

// Close the connection pool on SIGINT signal
// process.on("SIGINT", async () => {
//   console.log("Server is gracefully shutting down");
//   // Perform cleanup tasks (e.g., close database connections)
//   await sql.close();
//   console.log("Database connection closed");
//   process.exit(0); // Exit with code 0 indicating successful shutdown
// });
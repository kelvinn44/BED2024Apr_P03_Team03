// import required modules here
const express = require("express");
const sql = require("mssql");
const dbConfig = require("./dbConfig");
const bodyParser = require("body-parser");
const accountController = require('./controllers/accountController');
const eventsController = require("./controllers/eventsController");
const donationController = require('./controllers/donationController');
const validateUser = require("./middlewares/validateUserSignup");

const app = express();
const port = process.env.PORT || 3000;

const staticMiddleware = express.static("public"); // Path to the public folder

// Include body-parser middleware to handle JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling

app.use(staticMiddleware); // Mount the static middleware

// Routes
// route to handle user sign up:
app.post('/signup', validateUser, accountController.createUser);

// route to handle user login:
app.post('/login', accountController.loginUser);

// route to get user details:
app.get('/user/:id', accountController.getUser);

// route to update user details:
app.put('/user/:id', accountController.updateUser);

// route to get events:
app.get("/events", eventsController.getAllEvents);

// route to get events by id:
app.get("/events/:id", eventsController.getEventById);

// route to create events:
app.post("/events", eventsController.createEvent);

// route to update events:
app.put("/events/:id", eventsController.updateEvent);

// route to delete events:
app.delete("/events/:id", eventsController.deleteEvent);

// route to get latest donations:
app.get("/donations", donationController.getDonations);

// route to create a donation:
app.post("/donations", donationController.createDonation);


app.listen(port, async () => {
  try {
    // Connect to the database
    await sql.connect(dbConfig);
    console.log("Database connection established successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    // Terminate the application with an error code (optional)
    process.exit(1); // Exit with code 1 indicating an error
  }

  console.log(`Server listening on port ${port}`);
});

// Close the connection pool on SIGINT signal
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  // Perform cleanup tasks (e.g., close database connections)
  await sql.close();
  console.log("Database connection closed");
  process.exit(0); // Exit with code 0 indicating successful shutdown
});
// import required modules here
const express = require("express");
const sql = require("mssql");
require("dotenv").config();
const dbConfig = require("./dbConfig");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json"); // Import generated spec
const accountController = require('./controllers/accountController'); // Kelvin's function
const eventsController = require("./controllers/eventsController"); // Aaron's function
const eventSignUpController = require("./controllers/eventSignUpController");
const donationController = require('./controllers/donationController'); // Anne Marie's function
const forumController = require('./controllers/forumController'); // Natalie's function
const validateUser = require("./middlewares/validateUserSignup");
const validateForum = require('./middlewares/validateForum');
const validateDonation = require('./middlewares/validateDonation');
const validateEvent = require('./middlewares/validateEvent');
const authenticateAccount = require('./middlewares/authenticateAccount');

const app = express();
const port = process.env.PORT || 3000;

const staticMiddleware = express.static("public"); // Path to the public folder

// Include body-parser middleware to handle JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling

app.use(staticMiddleware); // Mount the static middleware

// Serve the Swagger UI at a specific route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
// route to handle user sign up - Kelvin's function:
app.post('/signup', validateUser, accountController.createUser);

// route to handle user login - Kelvin's function:
app.post('/login', accountController.loginUser);

// route to get user details - Kelvin's function:
app.get('/user/:id', authenticateAccount, accountController.getUser);

// route to update user details - Kelvin's function:
app.put('/editUser/:id', authenticateAccount, accountController.updateUser);

// route to get events - Aaron's function:
app.get("/events", eventsController.getAllEvents);

// route to get events by id - Aaron's function:
app.get("/events/:id", eventsController.getEventById);

// route to create events - Aaron's function:
app.post("/addEvents", validateEvent, authenticateAccount, eventsController.createEvent);

// route to update events - Aaron's function:
app.put("/editEvent/:id", validateEvent, authenticateAccount, eventsController.updateEvent);

// route to delete events - Aaron's function:
app.delete("/deleteEvent/:id", authenticateAccount, eventsController.deleteEvent);

// route to get event sign ups by account id - Aaron's function:
app.get("/eventSignUp/:id", authenticateAccount, eventSignUpController.getEventSignUpByAccId);

// route to create event sign ups - Aaron's function:
app.post("/eventSignUp", eventSignUpController.createEventSignUp);

//route to get all donations - Anne Marie's function:
app.get("/allDonations", authenticateAccount, donationController.getAllDonations);

// route to get 5 latest donations - Anne Marie's function:
app.get("/latestDonations", donationController.getDonations);

// route to create a donation - Anne Marie's function:
app.post("/donations", validateDonation, authenticateAccount, donationController.createDonation);

//route to get donations by account id - Anne Marie's function:
app.get("/donations/:id", authenticateAccount, donationController.getDonationsByAccountId);

//route to get a recurring donation by account id - Anne Marie's function:
app.get("/donations/recurring/:id", authenticateAccount, donationController.getRecurringDonation);

//route to post and update (existing) a recurring donation - Anne Marie's function:
app.post('/donations/recurring', authenticateAccount, donationController.updateRecurringDonation);

//route to get all posts - Natalie's function:
app.get("/allPosts", forumController.getAllPosts);

//route to get post by id - Natalie's function:
app.get("/posts/:id", forumController.getPostById);

//route to create a post - Natalie's function:
app.post("/posts", validateForum, authenticateAccount, forumController.createPost);

//route to update a post - Natalie's function:
app.put("/editPosts/:id", validateForum, authenticateAccount, forumController.updatePost);

//route to delete a post - Natalie's function:
app.delete("/deletePosts/:id", authenticateAccount, forumController.deletePost);

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

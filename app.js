// import required modules here
const express = require("express");
const sql = require("mssql");
const dbConfig = require("./dbConfig");
const bodyParser = require("body-parser");
const accountController = require('./controllers/accountController'); // Kelvin's function
const eventsController = require("./controllers/eventsController"); // Aaron's function
const donationController = require('./controllers/donationController'); // Anne Marie's function
const forumController = require('./controllers/forumController'); // Natalie's function
const validateUser = require("./middlewares/validateUserSignup");

const app = express();
const port = process.env.PORT || 3000;

const staticMiddleware = express.static("public"); // Path to the public folder

// Include body-parser middleware to handle JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling

app.use(staticMiddleware); // Mount the static middleware

// Routes
// route to handle user sign up - Kelvin's function:
app.post('/signup', validateUser, accountController.createUser);

// route to handle user login - Kelvin's function:
app.post('/login', accountController.loginUser);

// route to get user details - Kelvin's function:
app.get('/user/:id', accountController.getUser);

// route to update user details - Kelvin's function:
app.put('/user/:id', accountController.updateUser);

// route to get events - Aaron's function:
app.get("/events", eventsController.getAllEvents);

// route to get events by id - Aaron's function:
app.get("/events/:id", eventsController.getEventById);

// route to create events - Aaron's function:
app.post("/events", eventsController.createEvent);

// route to update events - Aaron's function:
app.put("/events/:id", eventsController.updateEvent);

// route to delete events - Aaron's function:
app.delete("/events/:id", eventsController.deleteEvent);

// route to get latest donations - Anne Marie's function:
app.get("/donations", donationController.getDonations);

// route to create a donation - Anne Marie's function:
app.post("/donations", donationController.createDonation);

//route to get all posts - Natalie's function:
app.get("/posts", forumController.getAllPosts);

//route to get post by id - Natalie's function:
app.get("/posts/:id", forumController.getPostById);

//route to create a post - Natalie's function:
app.post("/posts", forumController.createPost);

//route to update a post - Natalie's function:
app.put("/posts/:id", forumController.updatePost);

//route to delete a post - Natalie's function:
app.delete("/posts/:id", forumController.deletePost);


//For Polytechnic Library API routes (Week 11 & 12 Practical):


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
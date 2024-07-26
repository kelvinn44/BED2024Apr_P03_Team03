const jwt = require('jsonwebtoken');

function verifyJWT(req, res, next) {
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden. Token verification failed." });
    }

    // Check user role for authorization
    const authorizedRoles = {
      //Account
      "/user/:id": ["User", "EventAdmin", "ForumMod"], // User details can be accessed by User, EventAdmin, and ForumMod
      "/editUser/:id": ["User"], // Updating user details can be done by User only

      //Event
      "/addEvents": ["EventAdmin"], // Adding events can be done by EventAdmin only
      "/editEvent/:id": ["EventAdmin"], // Editing events can be done by EventAdmin only
      "/deleteEvent/:id": ["EventAdmin"], // Deleting events can be done by EventAdmin only
      "/eventSignUp/:id": ["User", "EventAdmin"], // Event signups by account ID can be accessed by User and EventAdmin

      //Donation
      "/allDonations": ["EventAdmin", "ForumMod"], // All donations can only be accessed by EventAdmin, and ForumMod
      "/donations/:id": ["User", "EventAdmin", "ForumMod"], // Specific donation details can be accessed by User, EventAdmin, and ForumMod
      "/donations/recurring/:id": ["User", "EventAdmin", "ForumMod"], // Specific recurring donation details can be accessed by User, EventAdmin, and ForumMod
      "/donations/recurring": ["User"], // Recurring donations can be done by User only
      "/donations": ["User"], // Donation can be done by User only

      //Forum
      "/posts": ["User", "ForumMod"], // Creating forum posts can be done by User and ForumMod
      "/editPosts/:id": ["User", "ForumMod"], // Edit forum posts can be done by User, and ForumMod
      "/deletePosts/:id": ["User", "ForumMod"], // Deleting forum posts can be done by Users, and ForumMods
    };

    const requestedEndpoint = req.url;
    const userRole = decoded.role;

    const authorizedRole = Object.entries(authorizedRoles).find(
      ([endpoint, roles]) => {
        const regex = new RegExp(`^${endpoint.replace(/:\w+/g, '\\w+')}$`); // Create RegExp from endpoint, replacing dynamic segments
        return regex.test(requestedEndpoint) && roles.includes(userRole);
      }
    );

    if (!authorizedRole) {
      return res.status(403).json({ message: "Forbidden. Insufficient permissions." });
    }

    req.user = decoded; // Attach decoded user information to the request object
    next();
  });
}

module.exports = verifyJWT;
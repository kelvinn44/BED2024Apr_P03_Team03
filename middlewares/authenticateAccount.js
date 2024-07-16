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

    console.log('Decoded user information:', decoded); //log

    // Check user role for authorization
    const authorizedRoles = {
    //ROUTES TO BE CHECKED (TBD):

      "GET /user/:id": ["User", "EventAdmin", "ForumMod"], // User details can be accessed by Users, EventAdmins, and ForumMods
      "PUT /user/:id": ["User"], // Updating user details can be done by Users
      "GET /eventSignUp/:id": ["User", "EventAdmin"], // Event signups by account ID can be accessed by Users and EventAdmins
      //"/events/:id": ["EventAdmin"], // Specific event details can be accessed by EventAdmins only
      // "POST /addEvents": ["EventAdmin"], // Creating events can be done by EventAdmins only
      //"GET /eventSignUp/:id": ["User", "EventAdmin"], // Event signups by account ID can be accessed by Users and EventAdmins
      
      // TO BE UPDATED
      //"POST /posts": ["User", "EventAdmin", "ForumMod"], // Forum posts can be accessed by Users, EventAdmins, and ForumMods
      //"/posts/:id": ["User", "EventAdmin", "ForumMod"], // Specific forum post details can be accessed by Users, EventAdmins, and ForumMods
    };

    const requestedEndpoint = req.url;
    const userRole = decoded.role;

    const authorizedRole = Object.entries(authorizedRoles).find(
      ([endpoint, roles]) => {
        const regex = new RegExp(`^${endpoint}$`); // Create RegExp from endpoint
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

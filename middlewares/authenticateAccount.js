const jwt = require('jsonwebtoken');

function verifyJWT(req, res, next) {
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Check user role for authorization
    const authorizedRoles = {
    //ROUTES TO BE CHECKED (TBD):

      "/user/:id": ["User", "EventAdmin", "ForumMod"], // User details can be accessed by Users, EventAdmins, and ForumMods
      //"/events/:id": ["EventAdmin"], // Specific event details can be accessed by EventAdmins only
      "/eventSignUp/:id": ["User", "EventAdmin"], // Event signups by account ID can be accessed by Users and EventAdmins
      "/eventSignUp": ["User"], // Creating event signups can be done by Users
      //"/donations": ["User", "EventAdmin"], // Donations list can be accessed by Users and EventAdmins
      //"/posts": ["User", "EventAdmin", "ForumMod"], // Forum posts can be accessed by Users, EventAdmins, and ForumMods
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
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = decoded; // Attach decoded user information to the request object
    next();
  });
}

module.exports = verifyJWT;

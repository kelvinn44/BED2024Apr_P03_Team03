const Joi = require("joi");

const validateUser = (req, res, next) => {
  const schema = Joi.object({
    firstname: Joi.string().min(1).max(50).required(),
    lastname: Joi.string().min(1).max(50).required(),
    email: Joi.string().email().required(),
    phone_number: Joi.string().pattern(/^[0-9]{8}$/).required(),  // Singapore phone numbers are exactly 8 digits
    password: Joi.string().min(6).max(20).required(),
  });

  const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body

  if (validation.error) {
    const errors = validation.error.details.map((error) => error.message);
    res.status(400).json({ message: "Validation error", errors });
    return; // Terminate middleware execution on validation error
  }

  next(); // If validation passes, proceed to the next route handler
};

module.exports = validateUser;
const Joi = require("joi");

const validateUser = (req, res, next) => {
  const schema = Joi.object({
    firstname: Joi.string().min(1).max(50).required().messages({
        'string.base': 'First name should be a type of text',
        'string.empty': 'First name cannot be empty',
        'string.min': 'First name should have at least 1 character',
        'string.max': 'First name should have at most 50 characters',
        'any.required': 'First name is required'
      }),
      lastname: Joi.string().min(1).max(50).required().messages({
        'string.base': 'Last name should be a type of text',
        'string.empty': 'Last name cannot be empty',
        'string.min': 'Last name should have at least 1 character',
        'string.max': 'Last name should have at most 50 characters',
        'any.required': 'Last name is required'
      }),
      email: Joi.string().email().required().messages({
        'string.base': 'Email should be a type of text',
        'string.email': 'Email must be a valid email',
        'string.empty': 'Email cannot be empty',
        'any.required': 'Email is required'
      }),
      phone_number: Joi.string().pattern(/^[0-9]{8}$/).required().messages({
        'string.base': 'Phone number should be a type of text',
        'string.empty': 'Phone number cannot be empty',
        'string.pattern.base': 'Phone number must be exactly 8 digits', // Singapore phone numbers are exactly 8 digits (To be checked)
        'any.required': 'Phone number is required'
      }),
      password: Joi.string().min(6).max(20).required().messages({
        'string.base': 'Password should be a type of text',
        'string.empty': 'Password cannot be empty',
        'string.min': 'Password should have at least 6 characters',
        'string.max': 'Password should have at most 20 characters',
        'any.required': 'Password is required'
      }),
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
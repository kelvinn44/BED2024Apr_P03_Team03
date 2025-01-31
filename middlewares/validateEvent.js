const Joi = require("joi");

const validateEvent = (req, res, next) => {
  const schema = Joi.object({
    event_title: Joi.string().min(1).max(50).required(),
    description: Joi.string().min(1).max(255).required(),
    event_date: Joi.date().iso().required(),
    location: Joi.string().min(1).max(255).required(),
    account_id: Joi.number().integer().positive().optional(),
  });

  const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body

  if (validation.error) {
    const errors = validation.error.details.map((error) => error.message);
    res.status(400).json({ message: "Validation error", errors });
    return; // Terminate middleware execution on validation error
  }

  next(); // If validation passes, proceed to the next route handler
};

module.exports = validateEvent;

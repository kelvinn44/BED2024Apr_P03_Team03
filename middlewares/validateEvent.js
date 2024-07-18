const Joi = require("joi");

const validateEvent = (req, res, next) => {
  const schema = Joi.object({
    event_title: Joi.string().min(1).max(20).required(),
    description: Joi.string().min(1).max(100).required(),
    event_date: Joi.date().iso().required(),
    location: Joi.string().min(1).max(20).required(),
    account_id: Joi.number().integer().optional(),
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

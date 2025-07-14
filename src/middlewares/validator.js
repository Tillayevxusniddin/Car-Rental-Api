const Joi = require('joi');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    const messages = error.details.map(i => i.message).join(',');
    return res.status(400).json({ message: "Kiritilgan ma'lumotlar noto'g'ri.", errors: messages });
  }
  next();
};

const schemas = {
  registerUser: Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
  loginUser: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  car: Joi.object({
    make: Joi.string().required(),
    model: Joi.string().required(),
    year: Joi.number().integer().min(1980).max(new Date().getFullYear() + 1).required(),
    pricePerDay: Joi.number().positive().required(), // Faqat musbat son
    availabilityStatus: Joi.boolean(),
    licensePlate: Joi.string(),
    imageUrl: Joi.string().uri(), // URL formatida bo'lishi kerak
    description: Joi.string()
  }),
  booking: Joi.object({
    carId: Joi.number().integer().required(),
    startDate: Joi.date().iso().required(), // ISO formatdagi sana (YYYY-MM-DD)
    endDate: Joi.date().iso().greater(Joi.ref('startDate')).required() // endDate startDate'dan keyin bo'lishi shart
  }),
  transaction: Joi.object({
    bookingId: Joi.number().integer().required(),
    paymentMethod: Joi.string().valid('card', 'cash').default('card') // Faqat 'card' yoki 'cash'
  })
};

module.exports = { validate, schemas };
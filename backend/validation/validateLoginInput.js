const Joi = require('joi');

module.exports = function(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().min(5).max(255).required()
  });
  return schema.validate(user);
};
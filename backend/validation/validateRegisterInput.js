const Joi = require('joi');

module.exports = function(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().min(5).max(255).required(),
    confirmPassword: Joi.string().required().valid(Joi.ref('password'))
  });
  return schema.validate(user);
};
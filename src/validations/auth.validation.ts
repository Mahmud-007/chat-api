import Joi from 'joi';

export const signupSchema = Joi.object({
  firstName: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  country: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

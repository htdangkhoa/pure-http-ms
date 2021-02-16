import Joi from 'joi';

export const loginRequestSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const registerRequestSchema = loginRequestSchema.keys({
  firstName: Joi.string(),
  lastName: Joi.string(),
});

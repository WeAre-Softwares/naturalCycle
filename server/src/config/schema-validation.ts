import * as Joi from 'joi';

export const JoiSchemaValidation = Joi.object({
  POSTGRES_USER: Joi.string().required().messages({
    'any.required': 'Please provide environment variable {#key}',
  }),
  POSTGRES_PASSWORD: Joi.string().required().messages({
    'any.required': 'Please provide environment variable {#key}',
  }),
  POSTGRES_DB: Joi.string().required().messages({
    'any.required': 'Please provide environment variable {#key}',
  }),
  POSTGRES_PORT: Joi.number().required().messages({
    'any.required': 'Please provide environment variable {#key}',
  }),
  JWT_SECRET: Joi.string().required().messages({
    'any.required': 'Please provide environment variable {#key}',
  }),
  JWT_EXPIRY: Joi.string().required().messages({
    'any.required': 'Please provide environment variable {#key}',
  }),
  CLOUDINARY_NAME: Joi.string().required().messages({
    'any.required': 'Please provide environment variable {#key}',
  }),
  CLOUDINARY_API_KEY: Joi.string().required().messages({
    'any.required': 'Please provide environment variable {#key}',
  }),
  CLOUDINARY_API_SECRET: Joi.string().required().messages({
    'any.required': 'Please provide environment variable {#key}',
  }),
  EMAIL_HOST: Joi.string().required().messages({
    'any.required': 'Please provide environment variable {#key}',
  }),
  EMAIL_USER: Joi.string().required().messages({
    'any.required': 'Please provide environment variable {#key}',
  }),
  EMAIL_PASSWORD: Joi.string().required().messages({
    'any.required': 'Please provide environment variable {#key}',
  }),
  EMAIL_FROM: Joi.string().required().messages({
    'any.required': 'Please provide environment variable {#key}',
  }),
  EMAIL_PORT: Joi.string().required().messages({
    'any.required': 'Please provide environment variable {#key}',
  }),
  PORT: Joi.number(),
  DB_HOST: Joi.string(),
  NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required().messages({
    'any.required': 'Please provide environment variable {#key}',
    'any.only': 'NODE_ENV must be one of [dev, prod, test]',
  }),
});

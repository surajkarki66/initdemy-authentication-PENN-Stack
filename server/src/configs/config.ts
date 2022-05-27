import dotenv from "dotenv";

dotenv.config();

const NODE_ENV = process.env.NODE_ENV;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

const SERVER_HOSTNAME = process.env.HOST || "localhost";
const SERVER_PORT = process.env.PORT || 5000;

const SERVER = {
  hostname: SERVER_HOSTNAME,
  port: SERVER_PORT,
};

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES;
const JWT_EXPIRES_IN_MILSEC = process.env.JWT_EXPIRES_IN_MILSEC;
const JWT_SECRET_FOR_EMAIL_ACTIVATION =
  process.env.JWT_SECRET_FOR_EMAIL_ACTIVATION;

const JWT_EXPIRES_FOR_EMAIL_ACTIVATION =
  process.env.JWT_EXPIRES_FOR_EMAIL_ACTIVATION;

const JWT_SECRET_FOR_FORGOT_PASSWORD =
  process.env.JWT_SECRET_FOR_FORGOT_PASSWORD;

const JWT_EXPIRES_FOR_FORGOT_PASSWORD =
  process.env.JWT_EXPIRES_FOR_FORGOT_PASSWORD;

const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
const MAILGUN_PRIVATE_API_KEY = process.env.MAILGUN_PRIVATE_API_KEY;
const EMAIL = process.env.EMAIL;

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

const config = {
  server: SERVER,
  env: NODE_ENV,
  url: CLIENT_URL,
  jwtSecret: JWT_SECRET,
  jwtExpires: JWT_EXPIRES,
  jwtExpiresInMilsec: JWT_EXPIRES_IN_MILSEC,
  jwtExpiresForEmailActivation: JWT_EXPIRES_FOR_EMAIL_ACTIVATION,
  jwtSecretForEmailActivation: JWT_SECRET_FOR_EMAIL_ACTIVATION,
  jwtExpiresForForgotPassword: JWT_EXPIRES_FOR_FORGOT_PASSWORD,
  jwtSecretForForgotPassword: JWT_SECRET_FOR_FORGOT_PASSWORD,
  mailgunDomain: MAILGUN_DOMAIN,
  mailgunPrivateAPIKey: MAILGUN_PRIVATE_API_KEY,
  email: EMAIL,
  cloudinaryCloudName: CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: CLOUDINARY_API_KEY,
  cloudinaryApiSecret: CLOUDINARY_API_SECRET,
};

export default config;

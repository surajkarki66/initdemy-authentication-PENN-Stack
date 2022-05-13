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

const STRIPE_KEY = process.env.STRIPE_KEY;
const STRIPE_REDIRECT_URL = process.env.STRIPE_REDIRECT_URL;

const config = {
  server: SERVER,
  env: NODE_ENV,
  url: CLIENT_URL,
  jwtSecret: JWT_SECRET,
  jwtExpires: JWT_EXPIRES,
  jwtExpiresInMilsec: JWT_EXPIRES_IN_MILSEC,
  stripeKey: STRIPE_KEY,
  stripeRedirectUrl: STRIPE_REDIRECT_URL,
};

export default config;

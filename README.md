# initdemy-authentication-PENN-Stack

## Get Started

This is a boilerplate of authentication system for initdemy which is a online education marketplace which is built using Express.js in backend and Next.js in frontend.

## First steps

- Make sure to have TSLint installed and set as default formatter
- Run `yarn install` or `npm i` inside the server folder before starting the server.
- create .env file. See example below.

```
NODE_ENV=development
CLIENT_URL=http://localhost:3000
HOST=localhost
PORT=5000

JWT_SECRET=<make-your-own-token>
JWT_EXPIRES=<token-expiration-time>
JWT_EXPIRES_IN_MILSEC=<token-expiration-time-in-milsec>
JWT_EXPIRES_FOR_EMAIL_ACTIVATION=<token-expiration-time>
JWT_SECRET_FOR_EMAIL_ACTIVATION=<make-your-own-token>
JWT_SECRET_FOR_FORGOT_PASSWORD=<make-your-own-token>
JWT_EXPIRES_FOR_FORGOT_PASSWORD=<token-expiration-time>

MAILGUN_DOMAIN=<Add-mailgun-domain>
MAILGUN_PRIVATE_API_KEY=<Add-mailgun-private-apikey>
EMAIL=<email>

CLOUDINARY_CLOUD_NAME=<Add-cloudinary-name>
CLOUDINARY_API_KEY=<Add-cloudinary-api-key>
CLOUDINARY_API_SECRET=<Add-cloudinary-api-secret>

```

## Running the server

- to run the development server, do `yarn run dev` or `npm run dev`
- to run the production server, do `yarn run build` or `npm run build` and `yarn start` or `npm start`

## Setting up and running the database

- Make sure you have postgresql installed locally
- Run `psql postgres` to start psql CLI and create database by running `create database initdemy;` and exit cli with `quit`
- Run `Runs seed scripts
  Runs seed scripts
- Run `npx prisma generate` or `yarn prisma generate` from the server folder to establish link between schema.prisma and .env file
- Run `npx prisma db push` or `yarn prisma db push` to create a new migrate (to sync database schema to prisma schema)

## Viewing the database data and tables

- Run `npx prisma studio` or `yarn prisma studio` to visualize the database and open localhost:5555 in the browser

## Updating schema / models

- Make changes
- Run `npx prisma migrate deploy` or `yarn prisma migrate deploy`

## Common errors with prisma studio

1. Database 'initdemy' does not exist:

- Create database with `create database initdemy;` in PSQL CLI
- Run `npx prisma studio` or `yarn prisma studio` from server folder.

2. Table "user" does not exist in DB

- Run `npx prisma generate` or `yarn prisma generate`
- Run `npx prisma db push` or `yarn prisma db push`

## Start the client. From the client folder, run

## Steps

- Make sure to have ESLint installed and set as default formatter
- Run `yarn install ` or `npm i` inside the client folder before starting the server.
- create .env.local file. See example below.

```
NEXT_PUBLIC_API=http://localhost:5000/api

```

## Running the server

- to run the development server, do `yarn run dev` or `npm run dev`

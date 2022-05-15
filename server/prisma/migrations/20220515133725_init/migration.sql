-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUBSCRIBER', 'ADMIN');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(256) NOT NULL,
    "firstName" VARCHAR(32) NOT NULL,
    "lastName" VARCHAR(32) NOT NULL,
    "password" VARCHAR(64) NOT NULL,
    "avatar" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT E'SUBSCRIBER',
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_firstName_lastName_idx" ON "users"("firstName", "lastName");

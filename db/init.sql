CREATE SCHEMA web;

SET search_path = web;
CREATE TABLE "Accounts" (
	"id" SERIAL NOT NULL,
	"name" VARCHAR NOT NULL,
	"email" VARCHAR NOT NULL,
	"verify_token" VARCHAR NULL DEFAULT NULL,
	"session_token" VARCHAR NULL DEFAULT NULL,
	PRIMARY KEY ("id"),
  UNIQUE ("name"),
  UNIQUE ("email")
);
CREATE INDEX "SessionIdx" ON "Accounts" ("session_token");
CREATE UNIQUE INDEX "UniqNameIdx" ON "Accounts" (lower("name"));
CREATE UNIQUE INDEX "UniqEmailIdx" ON "Accounts" (lower("email"));

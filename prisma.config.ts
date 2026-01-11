import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Temporary debug: print the DATABASE_URL prefix so we can confirm Prisma is reading the expected env value.
// This will log when you run prisma commands. Remove this once connection is verified.
console.log('PRISMA DEBUG DATABASE_URL prefix:', process.env.DATABASE_URL?.slice(0,80));

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),

  },
});

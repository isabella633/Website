import { neon } from "@neondatabase/serverless";

let connectionString =
  process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || "";

export const isDbConfigured = () => Boolean(connectionString);

export const getSql = () => {
  if (!connectionString) {
    throw new Error(
      "Database connection string is not configured. Set DATABASE_URL or NEON_DATABASE_URL.",
    );
  }
  return neon(connectionString);
};

export const setConnectionString = (url: string) => {
  connectionString = url;
};

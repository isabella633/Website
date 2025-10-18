import { neon } from "@neondatabase/serverless";

let connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || "";

// Create a lazy SQL client. If no connection string is configured, throw on first use
export const getSql = () => {
  if (!connectionString) {
    throw new Error("Database connection string is not configured. Set DATABASE_URL or NEON_DATABASE_URL.");
  }
  return neon(connectionString);
};

export const setConnectionString = (url: string) => {
  connectionString = url;
};

import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleScriptRaw } from "./routes/script";
import { handleProtectScript } from "./routes/protect";
import { handleGetScript, handleUpdateScript } from "./routes/script-data";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.post("/api/protect", handleProtectScript);
  app.get("/api/script/:scriptId/raw", handleScriptRaw);

  return app;
}

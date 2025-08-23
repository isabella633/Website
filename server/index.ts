import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleScriptRaw } from "./routes/script";
import { handleProtectScript } from "./routes/protect";
import { handleGetScript, handleUpdateScript, handleUpdateScriptName, handleDeleteScript } from "./routes/script-data";
import { handleGetUserScripts } from "./routes/user-scripts";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' })); // Increase limit for large Lua scripts
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.post("/api/protect", handleProtectScript);
  app.get("/api/user/:userId/scripts", handleGetUserScripts);
  app.get("/api/script/:scriptId", handleGetScript);
  app.put("/api/script/:scriptId", handleUpdateScript);
  app.patch("/api/script/:scriptId/name", handleUpdateScriptName);
  app.delete("/api/script/:scriptId", handleDeleteScript);
  app.get("/api/script/:scriptId/raw", handleScriptRaw);

  return app;
}

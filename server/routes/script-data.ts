import { RequestHandler } from "express";
import { getScript, updateScript } from "./protect";

export const handleGetScript: RequestHandler = (req, res) => {
  const { scriptId } = req.params;

  if (!scriptId) {
    return res.status(400).json({ error: "Script ID is required" });
  }

  const scriptData = getScript(scriptId);

  if (!scriptData) {
    return res.status(404).json({ error: "Script not found" });
  }

  res.json(scriptData);
};

export const handleUpdateScript: RequestHandler = (req, res) => {
  const { scriptId } = req.params;
  const { code, owner } = req.body;

  if (!scriptId || !code || !owner) {
    return res.status(400).json({ error: "Script ID, code, and owner are required" });
  }

  const scriptData = getScript(scriptId);

  if (!scriptData) {
    return res.status(404).json({ error: "Script not found" });
  }

  // Verify ownership
  if (scriptData.owner !== owner) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  // Update the script
  const updatedScript = {
    ...scriptData,
    code,
    updatedAt: new Date().toISOString()
  };

  // In the protect.ts file, I need to add an update function
  // For now, I'll import the scripts Map directly
  const { scripts } = require('./protect');
  scripts.set(scriptId, updatedScript);

  res.json(updatedScript);
};

import { RequestHandler } from "express";
import { getScript, updateScript, scripts } from "./protect";

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
    return res
      .status(400)
      .json({ error: "Script ID, code, and owner are required" });
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
    updatedAt: new Date().toISOString(),
  };

  updateScript(scriptId, updatedScript);
  res.json(updatedScript);
};

export const handleUpdateScriptName: RequestHandler = (req, res) => {
  const { scriptId } = req.params;
  const { name, owner } = req.body;

  if (!scriptId || !name || !owner) {
    return res.status(400).json({ error: "Script ID, name, and owner are required" });
  }

  const scriptData = getScript(scriptId);

  if (!scriptData) {
    return res.status(404).json({ error: "Script not found" });
  }

  // Verify ownership
  if (scriptData.owner !== owner) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  // Update the script name
  const updatedScript = {
    ...scriptData,
    name,
    updatedAt: new Date().toISOString()
  };

  updateScript(scriptId, updatedScript);
  res.json(updatedScript);
};

export const handleDeleteScript: RequestHandler = (req, res) => {
  const { scriptId } = req.params;
  const { owner } = req.body;

  if (!scriptId || !owner) {
    return res.status(400).json({ error: "Script ID and owner are required" });
  }

  const scriptData = getScript(scriptId);

  if (!scriptData) {
    return res.status(404).json({ error: "Script not found" });
  }

  // Verify ownership
  if (scriptData.owner !== owner) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  // Delete the script
  scripts.delete(scriptId);

  res.json({ message: "Script deleted successfully" });
};

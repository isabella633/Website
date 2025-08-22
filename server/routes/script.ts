import { RequestHandler } from "express";
import { getScript } from "./protect";

export const handleScriptRaw: RequestHandler = (req, res) => {
  const { scriptId } = req.params;

  if (!scriptId) {
    return res.status(400).json({ error: "Script ID is required" });
  }

  // Get the actual script data
  const scriptData = getScript(scriptId);

  if (!scriptData) {
    return res.status(404).json({ error: "Script not found" });
  }

  // Set appropriate headers for Lua content to display in browser
  res.setHeader("Content-Type", "text/plain; charset=utf-8");

  // Return only the raw script code, nothing else
  res.send(scriptData.code);
};

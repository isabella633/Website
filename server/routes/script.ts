import { RequestHandler } from "express";
import { getScriptById } from "../models/scripts";

export const handleScriptRaw: RequestHandler = async (req, res) => {
  const { scriptId } = req.params;

  if (!scriptId) {
    return res.status(400).json({ error: "Script ID is required" });
  }

  const scriptData = await getScriptById(scriptId);

  if (!scriptData) {
    return res.status(404).json({ error: "Script not found" });
  }

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.send(scriptData.code);
};

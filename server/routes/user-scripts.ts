import { RequestHandler } from "express";
import { listScriptsByOwner } from "../models/scripts";

export const handleGetUserScripts: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const scripts = await listScriptsByOwner(userId);

    res.json({ scripts, total: scripts.length });
  } catch (err) {
    console.error("Error fetching user scripts", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

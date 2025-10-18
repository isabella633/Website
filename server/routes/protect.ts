import { RequestHandler } from "express";
import { createScript } from "../models/scripts";

export const handleProtectScript: RequestHandler = async (req, res) => {
  try {
    const { code, owner, name } = req.body as { code?: string; owner?: string; name?: string };

    if (!code || !owner) {
      return res.status(400).json({ error: "Code and owner are required" });
    }

    const scriptName = name && name.trim().length > 0 ? name.trim() : "Untitled Script";

    const created = await createScript({ name: scriptName, code, ownerId: owner });

    return res.json({ scriptId: created.id, message: "Script protected successfully" });
  } catch (error) {
    console.error("Error protecting script:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

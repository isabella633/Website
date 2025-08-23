import { RequestHandler } from "express";
import { scripts } from "./protect";

export const handleGetUserScripts: RequestHandler = (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  // Filter scripts by owner
  const userScripts = Array.from(scripts.values()).filter(
    script => script.owner === userId
  );

  // Sort by creation date (newest first)
  const sortedScripts = userScripts.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Return scripts with metadata but without full code content for performance
  const scriptSummaries = sortedScripts.map(script => ({
    id: script.id,
    name: script.name,
    createdAt: script.createdAt,
    updatedAt: script.updatedAt || script.createdAt,
    codeLength: script.code.length,
    codePreview: script.code.substring(0, 200) + (script.code.length > 200 ? '...' : '')
  }));

  res.json({ scripts: scriptSummaries, total: scriptSummaries.length });
};

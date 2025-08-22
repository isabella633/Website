import { RequestHandler } from "express";

interface ScriptData {
  id: string;
  code: string;
  createdAt: string;
  owner: string;
}

// In-memory storage for demo (in production, use a database)
export const scripts: Map<string, ScriptData> = new Map();

export const handleProtectScript: RequestHandler = (req, res) => {
  const { code, owner } = req.body;

  if (!code || !owner) {
    return res.status(400).json({ error: "Code and owner are required" });
  }

  // Generate script ID
  const scriptId = Math.random().toString(36).substr(2, 12);

  const scriptData: ScriptData = {
    id: scriptId,
    code,
    createdAt: new Date().toISOString(),
    owner,
  };

  // Store the script
  scripts.set(scriptId, scriptData);

  res.json({ scriptId, message: "Script protected successfully" });
};

export const getScript = (scriptId: string): ScriptData | undefined => {
  return scripts.get(scriptId);
};

export const updateScript = (
  scriptId: string,
  updatedData: ScriptData,
): void => {
  scripts.set(scriptId, updatedData);
};

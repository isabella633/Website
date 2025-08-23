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
  try {
    const { code, owner } = req.body;

    console.log('Protect script request:', {
      codeLength: code?.length || 0,
      owner: owner || 'undefined',
      hasCode: !!code,
      hasOwner: !!owner
    });

    if (!code || !owner) {
      console.log('Missing required fields:', { code: !!code, owner: !!owner });
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

    console.log('Script protected successfully:', { scriptId, codeLength: code.length });
    res.json({ scriptId, message: "Script protected successfully" });
  } catch (error) {
    console.error('Error protecting script:', error);
    res.status(500).json({ error: "Internal server error" });
  }
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

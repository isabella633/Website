import { RequestHandler } from "express";

export const handleScriptRaw: RequestHandler = (req, res) => {
  const { scriptId } = req.params;

  if (!scriptId) {
    return res.status(400).json({ error: "Script ID is required" });
  }

  // In a real application, you would fetch this from a database
  // For now, we'll return a placeholder response since the actual data is stored client-side
  // In production, you'd want to validate the user's access rights and fetch from a secure database

  const luaScript = `-- Protected Lua Script
-- Script ID: ${scriptId}
-- This is a placeholder response for the raw script endpoint
-- In a production environment, this would serve the actual protected script content

print("Hello from protected Lua script!")
print("Script ID: ${scriptId}")

-- Your actual script content would be served here
-- This endpoint provides raw access to the Lua code
`;

  // Set appropriate headers for Lua content
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="script_${scriptId}.lua"`,
  );

  res.send(luaScript);
};

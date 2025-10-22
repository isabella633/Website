import { RequestHandler } from "express";
import { getScriptById } from "../models/scripts";

export const handleScriptRaw: RequestHandler = async (req, res) => {
  const { scriptId } = req.params;
  const ownerFromQuery = (req.query.owner as string) || undefined;
  const ownerFromHeader = (req.header("x-user-id") as string) || undefined;
  const requester = ownerFromQuery || ownerFromHeader;

  if (!scriptId) {
    return res.status(400).json({ error: "Script ID is required" });
  }

  if (!requester) {
    return res.status(401).json({ error: "Owner authentication required" });
  }

  const scriptData = await getScriptById(scriptId);

  if (!scriptData) {
    return res.status(404).json({ error: "Script not found" });
  }

  if (scriptData.owner_id !== requester) {
    return res.status(403).json({ error: "Forbidden" });
  }

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.send(scriptData.code);
};

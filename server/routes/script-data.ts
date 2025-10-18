import { RequestHandler } from "express";
import { getScriptById, updateScriptCode, updateScriptName as renameScript, deleteScript as removeScript } from "../models/scripts";

export const handleGetScript: RequestHandler = async (req, res) => {
  const { scriptId } = req.params;

  if (!scriptId) {
    return res.status(400).json({ error: "Script ID is required" });
  }

  const script = await getScriptById(scriptId);
  if (!script) {
    return res.status(404).json({ error: "Script not found" });
  }

  res.json({
    id: script.id,
    name: script.name,
    code: script.code,
    createdAt: script.created_at,
    updatedAt: script.updated_at ?? undefined,
    owner: script.owner_id,
  });
};

export const handleUpdateScript: RequestHandler = async (req, res) => {
  const { scriptId } = req.params;
  const { code, owner } = req.body as { code?: string; owner?: string };

  if (!scriptId || !code || !owner) {
    return res.status(400).json({ error: "Script ID, code, and owner are required" });
  }

  const updated = await updateScriptCode(scriptId, owner, code);
  if (!updated) {
    return res.status(404).json({ error: "Script not found or unauthorized" });
  }

  res.json({
    id: updated.id,
    name: updated.name,
    code: updated.code,
    createdAt: updated.created_at,
    updatedAt: updated.updated_at ?? undefined,
    owner: updated.owner_id,
  });
};

export const handleUpdateScriptName: RequestHandler = async (req, res) => {
  const { scriptId } = req.params;
  const { name, owner } = req.body as { name?: string; owner?: string };

  if (!scriptId || !name || !owner) {
    return res.status(400).json({ error: "Script ID, name, and owner are required" });
  }

  const updated = await renameScript(scriptId, owner, name);
  if (!updated) {
    return res.status(404).json({ error: "Script not found or unauthorized" });
  }

  res.json({
    id: updated.id,
    name: updated.name,
    code: updated.code,
    createdAt: updated.created_at,
    updatedAt: updated.updated_at ?? undefined,
    owner: updated.owner_id,
  });
};

export const handleDeleteScript: RequestHandler = async (req, res) => {
  const { scriptId } = req.params;
  const { owner } = req.body as { owner?: string };

  if (!scriptId || !owner) {
    return res.status(400).json({ error: "Script ID and owner are required" });
  }

  const deleted = await removeScript(scriptId, owner);
  if (!deleted) {
    return res.status(404).json({ error: "Script not found or unauthorized" });
  }

  res.json({ message: "Script deleted successfully" });
};

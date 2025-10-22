import { getSql, isDbConfigured } from "../db";

export interface ScriptRow {
  id: string;
  name: string;
  code: string;
  created_at: string;
  updated_at: string | null;
  owner_id: string;
}

export interface ScriptSummary {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string | null;
  codeLength: number;
  codePreview: string;
}

export async function createScript(params: { name: string; code: string; ownerId: string }): Promise<{ id: string } & Pick<ScriptRow, "name" | "code" | "created_at" | "owner_id">> {
  const sql = getSql();
  const id = `scr_${Math.random().toString(36).slice(2, 12)}`;
  const rows = await sql<{ id: string; name: string; code: string; created_at: string; owner_id: string }>`
    INSERT INTO scripts (id, name, code, owner_id)
    VALUES (${id}, ${params.name}, ${params.code}, ${params.ownerId})
    RETURNING id, name, code, created_at, owner_id`;
  return rows[0];
}

export async function getScriptById(id: string): Promise<ScriptRow | null> {
  const sql = getSql();
  const rows = await sql<ScriptRow>`SELECT id, name, code, created_at, updated_at, owner_id FROM scripts WHERE id = ${id}`;
  return rows[0] ?? null;
}

export async function listScriptsByOwner(ownerId: string): Promise<ScriptSummary[]> {
  const sql = getSql();
  const rows = await sql<ScriptRow>`
    SELECT id, name, code, created_at, updated_at, owner_id
    FROM scripts
    WHERE owner_id = ${ownerId}
    ORDER BY created_at DESC`;
  return rows.map((s) => ({
    id: s.id,
    name: s.name,
    createdAt: s.created_at,
    updatedAt: s.updated_at,
    codeLength: s.code.length,
    codePreview: s.code.substring(0, 200) + (s.code.length > 200 ? "..." : ""),
  }));
}

export async function updateScriptCode(id: string, ownerId: string, code: string) {
  const sql = getSql();
  const rows = await sql<ScriptRow>`
    UPDATE scripts
    SET code = ${code}, updated_at = NOW()
    WHERE id = ${id} AND owner_id = ${ownerId}
    RETURNING id, name, code, created_at, updated_at, owner_id`;
  return rows[0] ?? null;
}

export async function updateScriptName(id: string, ownerId: string, name: string) {
  const sql = getSql();
  const rows = await sql<ScriptRow>`
    UPDATE scripts
    SET name = ${name}, updated_at = NOW()
    WHERE id = ${id} AND owner_id = ${ownerId}
    RETURNING id, name, code, created_at, updated_at, owner_id`;
  return rows[0] ?? null;
}

export async function deleteScript(id: string, ownerId: string) {
  const sql = getSql();
  const rows = await sql<{ id: string }>`DELETE FROM scripts WHERE id = ${id} AND owner_id = ${ownerId} RETURNING id`;
  return rows[0] ?? null;
}

import bcrypt from "bcryptjs";
import { getSql, isDbConfigured } from "../db";

export interface UserRow {
  id: string;
  email: string;
  username: string;
  password_hash: string;
  created_at: string;
}

export interface PublicUser {
  id: string;
  email: string;
  username: string;
}

export async function findUserByEmail(email: string): Promise<UserRow | null> {
  const sql = getSql();
  const rows = await sql<UserRow>`SELECT id, email, username, password_hash, created_at FROM users WHERE email = ${email}`;
  return rows[0] ?? null;
}

export async function findUserById(id: string): Promise<PublicUser | null> {
  const sql = getSql();
  const rows = await sql<PublicUser>`SELECT id, email, username FROM users WHERE id = ${id}`;
  return rows[0] ?? null;
}

export async function createUser(email: string, username: string, password: string): Promise<PublicUser> {
  const sql = getSql();
  const passwordHash = await bcrypt.hash(password, 10);
  const id = `usr_${Math.random().toString(36).slice(2, 12)}`;
  const rows = await sql<PublicUser>`INSERT INTO users (id, email, username, password_hash) VALUES (${id}, ${email}, ${username}, ${passwordHash}) RETURNING id, email, username`;
  return rows[0];
}

export async function verifyUser(email: string, password: string): Promise<PublicUser | null> {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return null;
  return { id: user.id, email: user.email, username: user.username };
}

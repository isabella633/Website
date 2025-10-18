import { RequestHandler } from "express";
import { createUser, findUserByEmail, verifyUser } from "../models/users";

export const handleSignup: RequestHandler = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      return res.status(400).json({ error: "Email, username and password are required" });
    }
    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "Email already in use" });
    }
    const user = await createUser(email, username, password);
    return res.json({ user });
  } catch (err: any) {
    console.error("Signup error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const handleLogin: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await verifyUser(email, password);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    return res.json({ user });
  } catch (err: any) {
    console.error("Login error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

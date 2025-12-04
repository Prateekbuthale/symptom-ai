import { db } from "../config/db.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const signup = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Missing fields" });

  const hashed = await hashPassword(password);
  try {
    await db.query("INSERT INTO users (email, password) VALUES ($1, $2)", [
      email,
      hashed,
    ]);
    return res.json({ success: true });
  } catch (err) {
    if (err.code === "23505")
      return res.status(400).json({ error: "Email already used" });
    return res.status(500).json({ error: "DB error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const userQ = await db.query("SELECT * FROM users WHERE email=$1", [email]);
  if (!userQ.rows.length)
    return res.status(400).json({ error: "Invalid email or password" });

  const user = userQ.rows[0];
  const valid = await comparePassword(password, user.password);
  if (!valid)
    return res.status(400).json({ error: "Invalid email or password" });

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  return res.json({ token });
};

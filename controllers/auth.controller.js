import users from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  const [exist] = await users.query("SELECT id FROM users WHERE email=?", [
    email,
  ]);
  if (exist.length) return res.status(400).json({ message: "Email exists" });

  const hashed = await bcrypt.hash(password, 10);
  await users.query(
    "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)",
    [name, email, hashed, role || "editor"],
  );

  res.status(201).json({ success: true, message: "User registered" });
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await users.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (!rows.length) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

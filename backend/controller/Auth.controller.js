import pool from "../config/db.js";
import bcrypt from "bcrypt";
import { genrateAccessToken, genrateRefresToken } from "../utils/GenrateToken.js";

export const signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "username, email and password are required." });
    }

    username = username.trim();
    email = email.trim().toLowerCase();

    const checkUser = await pool.query(
      "SELECT * FROM users WHERE LOWER(email) = $1 OR LOWER(username) = LOWER($2)",
      [email, username]
    );

    if (checkUser.rows.length > 0) {
      return res.status(409).json({ message: "Username or email already exists. Please login." });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, hash]
    );

    const user = newUser.rows[0];
    const accessToken = genrateAccessToken(user.id);
    const refreshToken = genrateRefresToken(user.id);

    return res.status(201).json({
      message: "User signed up successfully.",
      accessToken,
      refreshToken,
      user,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong.", error: error.message });
  }
};

// ─── SIGNIN ──────────────────────────────────────────────────────────────────
export const signin = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    email = email.trim().toLowerCase();

    const checkUser = await pool.query(
      "SELECT * FROM users WHERE LOWER(email) = $1",
      [email]
    );

    if (checkUser.rows.length === 0) {
      return res.status(404).json({ message: "User not found. Please sign up first." });
    }

    const user = checkUser.rows[0];

    const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    const accessToken = genrateAccessToken(user.id);
    const refreshToken = genrateRefresToken(user.id);

    return res.status(200).json({
      message: "User signed in successfully.",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong.", error: error.message });
  }
};

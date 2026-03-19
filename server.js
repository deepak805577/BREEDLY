import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./models/user.js"; // Import only ONCE

// ✅ DEFINE APP FIRST
const app = express();

// ✅ CORS + JSON (must be after app)
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(express.json());
app.options(/.*/, cors());

// CONNECT DB
console.log("MONGO_URI:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("📌 Database Connected"))
  .catch(err => console.log("❌ DB Error:", err));

// REGISTER ROUTE
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).send({ error: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    await new User({ username, email, password: hashed }).save();

    res.send({ message: "User registered!" });
  } catch {
    res.status(500).send({ error: "Server error" });
  }
});

// LOGIN ROUTE
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).send({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).send({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.send({ message: "Login successful", token, username: user.username });
  } catch {
    res.status(500).send({ error: "Server error" });
  }
});

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

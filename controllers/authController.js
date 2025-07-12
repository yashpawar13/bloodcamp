// server/controllers/authController.js
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "User doesn't exist!" });
    }

    // Validate password (you can hash and compare if using bcrypt)
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ Update last_login with current time
    const now = new Date();
    user.last_login = now;
    await user.save();

    // ✅ Generate JWT token
    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        full_name: user.full_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "20m" }
    );

    // ✅ Return token and user info
    return res.json({
      token,
      user: {
        full_name: user.full_name,
        email: user.email,
        last_login: user.last_login,
        last_logout: user.last_logout,
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Update last_logout
    user.last_logout = new Date();
    await user.save();

    return res.json({ message: "Logout timestamp updated" });

  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

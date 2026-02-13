const jwt = require("jsonwebtoken");
const User = require("../models/User");

class AuthController {

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ 
          error: "Email and password are required" 
        });
      }

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return res.status(401).json({ 
          error: "Invalid credentials" 
        });
      }

      const isPasswordValid = await user.validatePassword(password);

      if (!isPasswordValid) {
        return res.status(401).json({ 
          error: "Invalid credentials" 
        });
      }

      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
      );

      user.password = undefined;

      return res.status(200).json({
        user,
        token,
      });
    } catch (error) {
      return res.status(500).json({ 
        error: "Erro ao realizar login",
        message: error.message 
      });
    }
  }

  async me(req, res) {
    try {
      const user = await User.findById(req.userId).select();

      if (!user) {
        return res.status(404).json({ 
          error: "User not found" 
        });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ 
        error: "Error fetching user data",
        message: error.message 
      });
    }
  }
}

module.exports = new AuthController();

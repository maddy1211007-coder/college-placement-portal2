const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const router = express.Router();

// Register a new user
router.post("/register", async function (req, res) {
  try {
    const {
      role,
      name,
      registerNumber,
      facultyId,
      email,
      phone,
      department,
      year,
      password
    } = req.body;

    // Check required fields
    if (!role || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Role, name, email and password are required"
      });
    }

    // Check valid role
    if (!["student", "professor"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role"
      });
    }

    // Student must have register number
    if (role === "student" && !registerNumber) {
      return res.status(400).json({
        success: false,
        message: "Register number is required for students"
      });
    }

    // Professor must have faculty ID
    if (role === "professor" && !facultyId) {
      return res.status(400).json({
        success: false,
        message: "Faculty ID is required for professors"
      });
    }

    // Check existing email
    const existingEmail = await User.findOne({
      email: email.toLowerCase().trim()
    });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered"
      });
    }

    // Check student register number
    if (role === "student") {
      const existingRegisterNumber = await User.findOne({
        registerNumber: registerNumber.trim()
      });

      if (existingRegisterNumber) {
        return res.status(409).json({
          success: false,
          message: "Register number is already registered"
        });
      }
    }

    // Check professor faculty ID
    if (role === "professor") {
      const existingFacultyId = await User.findOne({
        facultyId: facultyId.trim()
      });

      if (existingFacultyId) {
        return res.status(409).json({
          success: false,
          message: "Faculty ID is already registered"
        });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      role,
      name: name.trim(),
      registerNumber:
        role === "student" ? registerNumber.trim() : undefined,
      facultyId:
        role === "professor" ? facultyId.trim() : undefined,
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : undefined,
      department: department ? department.trim() : undefined,
      year: year ? year.trim() : undefined,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Registration Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while registering user"
    });
  }
});

module.exports = router;
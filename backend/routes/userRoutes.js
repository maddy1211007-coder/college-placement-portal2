const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async function (req, res) {
  try {
    const {
      role,
      name,
      registerNumber,
      facultyId,
      email,
      phone,
      dateOfBirth,
      gender,
      department,
      year,
      section,
      cgpa,
      tenthPercentage,
      twelfthPercentage,
      activeBacklogs,
      graduationYear,
      programmingSkills,
      technicalSkills,
      preferredRole,
      languages,
      password
    } = req.body;

    // Required common fields
    if (!role || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Role, name, email and password are required"
      });
    }

    // Check role
    if (!["student", "professor"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role"
      });
    }

    // Student-specific validation
    if (role === "student" && !registerNumber) {
      return res.status(400).json({
        success: false,
        message: "Register number is required for students"
      });
    }

    // Professor-specific validation
    if (role === "professor" && !facultyId) {
      return res.status(400).json({
        success: false,
        message: "Faculty ID is required for professors"
      });
    }

    // Check duplicate email
    const existingEmail = await User.findOne({
      email: email.toLowerCase().trim()
    });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered"
      });
    }

    // Check duplicate student register number
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

    // Check duplicate professor faculty ID
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

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      role,

      name: name.trim(),

      registerNumber:
        role === "student" && registerNumber
          ? registerNumber.trim()
          : undefined,

      facultyId:
        role === "professor" && facultyId
          ? facultyId.trim()
          : undefined,

      email: email.toLowerCase().trim(),

      phone: phone ? phone.trim() : undefined,

      dateOfBirth: dateOfBirth
        ? new Date(dateOfBirth)
        : undefined,

      gender: gender || undefined,

      department: department
        ? department.trim()
        : undefined,

      year: year
        ? year.trim()
        : undefined,

      section: section
        ? section.trim()
        : undefined,

      cgpa:
        cgpa !== undefined && cgpa !== ""
          ? Number(cgpa)
          : undefined,

      tenthPercentage:
        tenthPercentage !== undefined &&
        tenthPercentage !== ""
          ? Number(tenthPercentage)
          : undefined,

      twelfthPercentage:
        twelfthPercentage !== undefined &&
        twelfthPercentage !== ""
          ? Number(twelfthPercentage)
          : undefined,

      activeBacklogs:
        activeBacklogs !== undefined &&
        activeBacklogs !== ""
          ? Number(activeBacklogs)
          : undefined,

      graduationYear:
        graduationYear !== undefined &&
        graduationYear !== ""
          ? Number(graduationYear)
          : undefined,

      programmingSkills: programmingSkills
        ? programmingSkills.trim()
        : undefined,

      technicalSkills: technicalSkills
        ? technicalSkills.trim()
        : undefined,

      preferredRole: preferredRole
        ? preferredRole.trim()
        : undefined,

      languages: languages
        ? languages.trim()
        : undefined,

      password: hashedPassword
    });

    // Save user to MongoDB
    await user.save();

    // Send successful response
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

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A user with this information already exists"
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while registering user"
    });
  }
});

router.post("/login", async function (req, res) {
  try {
    const {
      role,
      loginId,
      password
    } = req.body;

    // Check required fields
    if (!role || !loginId || !password) {
      return res.status(400).json({
        success: false,
        message: "Role, login ID and password are required"
      });
    }

    // Validate role
    if (!["student", "professor"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role"
      });
    }

    // Find user according to role
    let user;

    if (role === "student") {
      user = await User.findOne({
        registerNumber: loginId.trim()
      });
    }

    if (role === "professor") {
      user = await User.findOne({
        facultyId: loginId.trim()
      });
    }

    // User not found
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid login ID or password"
      });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid login ID or password"
      });
    }

    // Successful login
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        registerNumber: user.registerNumber,
        facultyId: user.facultyId,
        department: user.department
      }
    });

  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while logging in"
    });
  }
});

module.exports = router;
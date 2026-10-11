const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["student", "professor"],
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    registerNumber: {
      type: String,
      trim: true,
      unique: true,
      sparse: true
    },

    facultyId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },

    phone: {
      type: String,
      trim: true
    },

    dateOfBirth: {
      type: Date
    },

    gender: {
      type: String,
      trim: true
    },

    department: {
      type: String,
      trim: true
    },

    year: {
      type: String,
      trim: true
    },

    section: {
      type: String,
      trim: true
    },

    cgpa: {
      type: Number,
      min: 0,
      max: 10
    },

    tenthPercentage: {
      type: Number,
      min: 0,
      max: 100
    },

    twelfthPercentage: {
      type: Number,
      min: 0,
      max: 100
    },

    activeBacklogs: {
      type: Number,
      min: 0,
      max: 20
    },

    graduationYear: {
      type: Number
    },

    programmingSkills: {
      type: String,
      trim: true
    },

    technicalSkills: {
      type: String,
      trim: true
    },

    preferredRole: {
      type: String,
      trim: true
    },

    languages: {
      type: String,
      trim: true
    },

    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);
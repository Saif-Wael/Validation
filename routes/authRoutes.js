const express = require("express");
const { register, login } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/User");
const { isValidEmail, isStrongPassword, formatName, isValidMobileNumber } = require("../helpers/userValidator");
const bcrypt = require("bcryptjs");

const router = express.Router();

router.post("/register", register);  
router.post("/login", login);       

router.post("/validate", (req, res) => {
    try {
        const { email, password, firstName, lastName, mobileNumber, gender } = req.body;
        
        if (!email || !password || !firstName || !lastName || !mobileNumber || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const results = {
            email: {
                isValid: isValidEmail(email),
                message: isValidEmail(email) ? "Valid email format" : "Invalid email format"
            },
            password: {
                isValid: isStrongPassword(password),
                message: isStrongPassword(password) ? "Password meets requirements" : "Password must be at least 8 characters long and contain uppercase, lowercase, and numbers"
            },
            firstName: {
                isValid: firstName && firstName.length >= 2,
                message: firstName && firstName.length >= 2 ? "Valid first name" : "First name must be at least 2 characters long"
            },
            lastName: {
                isValid: lastName && lastName.length >= 2,
                message: lastName && lastName.length >= 2 ? "Valid last name" : "Last name must be at least 2 characters long"
            },
            mobileNumber: {
                isValid: isValidMobileNumber(mobileNumber),
                message: isValidMobileNumber(mobileNumber) ? "Valid mobile number" : "Mobile number must be exactly 11 digits"
            },
            gender: {
                isValid: gender && ['male', 'female', 'other'].includes(gender.toLowerCase()),
                message: gender && ['male', 'female', 'other'].includes(gender.toLowerCase()) ? "Valid gender" : "Invalid gender value"
            }
        };

        res.json(results);
    } catch (error) {
        console.error("Validation error:", error);
        res.status(500).json({ message: "Error during validation" });
    }
});

router.post("/update", async (req, res) => {
    try {
        const { email, password, firstName, lastName, mobileNumber, gender } = req.body;

        // Validate required fields
        if (!email || !firstName || !lastName || !mobileNumber || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user data
        user.firstName = firstName;
        user.lastName = lastName;
        user.mobileNumber = mobileNumber;
        user.gender = gender;

        // Only update password if it's provided and different
        if (password && password !== user.password) {
            try {
                const hashedPassword = await bcrypt.hash(password, 10);
                user.password = hashedPassword;
            } catch (hashError) {
                console.error("Password hashing error:", hashError);
                return res.status(500).json({ message: "Error updating password" });
            }
        }

        await user.save();
        res.json({ message: "User data updated successfully" });
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ message: "Error updating user data" });
    }
});

router.get("/users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

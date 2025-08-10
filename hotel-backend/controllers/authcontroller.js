const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// ✅ REGISTER CONTROLLER
exports.registeruser = async (req, res) => {
  const { firstname, middlename, lastname, email, password, phone } = req.body;

  try {
    const existinguser = await User.findOne({ email });
    if (existinguser) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstname,
      middlename,
      lastname,
      email,
      password: hashedPassword,
      phone,
      role: "user", // Optional: default role
    });

    res.status(201).json({ msg: "Registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ msg: err.message });
  }
};

// ✅ LOGIN CONTROLLER
exports.loginuser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: "Invalid credentials | Invalid Email" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ msg: "Invalid credentials | Wrong Password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    console.log(token);

    res.status(200).json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

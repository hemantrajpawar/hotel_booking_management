const User = require("../models/user");
const bcrypt = require("bcryptjs");

// @desc Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // exclude password
    if (!user) return res.status(404).json({ msg: 'User not found !!!' });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
}

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude password
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Server Error: Unable to fetch users" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Server Error: Unable to get user" });
  }
};


// DELETE /api/users/:id - Delete a specific user
exports.deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Server Error: Unable to delete user" });
  }
};

// PUT /api/users/profile
exports.updateProfile = async (req, res) => {
  try {
    const { firstname,middlename,lastname, email, phone, photo } = req.body; // photo is base64 or binary
    const user = await User.findById(req.user.id);
    console.log("user :",user);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (photo) {
      // Store base64 or buffer in DB
      user.profilePhoto = photo;
    }

    user.firstname = firstname || user.firstname;
    user.middlename = middlename || user.middlename;
    user.lastname = lastname || user.lastname;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    await user.save();
    res.json({ message: "Profile updated" });
  } catch (err) {
    console.error("Profile update failed:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc Change password
exports.updatePassword = async (req, res) => {
  const { current, new: newPassword } = req.body;
  const user = await User.findById(req.user.id);

  const isMatch = await bcrypt.compare(current, user.password);
  if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "Password updated successfully" });
};

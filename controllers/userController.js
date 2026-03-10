const UserModel = require("../models/userModel");

const createUser = async (req, res) => {
  try {
    const { full_name, email, phone, role } = req.body;

    if (!full_name || !email || !role) {
      return res.status(400).json({
        success: false,
        message: "full_name, email, and role are required",
      });
    }

    const result = await UserModel.createUser({ full_name, email, phone, role });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        id: result.insertId,
        full_name,
        email,
        phone,
        role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

module.exports = {
  createUser,
  getAllUsers,
};
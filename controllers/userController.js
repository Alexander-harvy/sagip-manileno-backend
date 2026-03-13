const bcrypt = require("bcrypt");
const UserModel = require("../models/userModel");

const createUser = async (req, res) => {
  try {
    const { first_name, last_name, contact_no, password } = req.body;

    if (!first_name || !last_name || !contact_no || !password) {
      return res.status(400).json({
        success: false,
        message: "first_name, last_name, contact_no, and password are required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await UserModel.createUser({
      first_name,
      last_name,
      contact_no,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        user_id: result.insertId,
        first_name,
        last_name,
        contact_no,
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
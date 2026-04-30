const jwt = require("jsonwebtoken");
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

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.getUserById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { contact_no, password } = req.body;

    if (!contact_no || !password) {
      return res.status(400).json({
        success: false,
        message: "contact_no and password are required",
      });
    }

    const user = await UserModel.getUserByContactNo(contact_no);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user.user_id,
        role: "user",
        contact_no: user.contact_no,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          user_id: user.user_id,
          first_name: user.first_name,
          last_name: user.last_name,
          contact_no: user.contact_no,
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

const getMyIncidents = async (req, res) => {
  try {
    const user_id = req.user.id;

    if (!user_id) {
      return res.status(401).json({
        success: false,
        message: "Invalid user token",
      });
    }

    const incidents = await UserModel.getIncidentsByUserId(user_id);

    const mapped = incidents.map((incident) => ({
      ...incident,
      is_assigned: incident.assign_id !== null,
      has_responder: incident.responder_id !== null,
    }));

    return res.status(200).json({
      success: true,
      message: "User incidents retrieved successfully",
      data: mapped,
    });
  } catch (error) {
    console.error("getMyIncidents error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve user incidents",
      error: error.message,
    });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  loginUser,
  getMyIncidents,
};
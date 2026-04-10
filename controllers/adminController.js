const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AdminModel = require("../models/adminModel");


const bootstrapAdmin = async (req, res) => {
  try {
    const { dept_id, first_name, last_name, contact_no, password, role } = req.body;

    if (!dept_id || !first_name || !last_name || !contact_no || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "dept_id, first_name, last_name, contact_no, password, and role are required",
      });
    }

    const adminCount = await AdminModel.countAdmins();

    if (adminCount > 0) {
      return res.status(403).json({
        success: false,
        message: "Initial admin already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await AdminModel.createAdmin({
      dept_id,
      first_name,
      last_name,
      contact_no,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      success: true,
      message: "Initial admin created successfully",
      data: {
        admin_id: result.insertId,
        dept_id,
        first_name,
        last_name,
        contact_no,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create initial admin",
      error: error.message,
    });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { contact_no, password } = req.body;

    if (!contact_no || !password) {
      return res.status(400).json({
        success: false,
        message: "contact_no and password are required",
      });
    }

    const admin = await AdminModel.findByContactNo(contact_no);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        admin_id: admin.admin_id,
        dept_id: admin.dept_id,
        contact_no: admin.contact_no,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      data: {
      admin_id: admin.admin_id,
      dept_id: admin.dept_id,
      first_name: admin.first_name,
      last_name: admin.last_name,
      contact_no: admin.contact_no,
      role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to login admin",
      error: error.message,
    });
  }
};

const createAdmin = async (req, res) => {
  try {
    const { dept_id, first_name, last_name, contact_no, password, role } = req.body;

    if (!dept_id || !first_name || !last_name || !contact_no || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "dept_id, first_name, last_name, contact_no, and password are required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await AdminModel.createAdmin({
      dept_id,
      first_name,
      last_name,
      contact_no,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: {
        admin_id: result.insertId,
        dept_id,
        first_name,
        last_name,
        contact_no,
        role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create admin",
      error: error.message,
    });
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const admins = await AdminModel.getAllAdmins();
    res.status(200).json({
      success: true,
      data: admins,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch admins",
      error: error.message,
    });
  }
};

const getAdminById = async (req, res) => {
  try {
    const admin = await AdminModel.getAdminById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin",
      error: error.message,
    });
  }
};

module.exports = {
  bootstrapAdmin,
  loginAdmin,
  createAdmin,
  getAllAdmins,
  getAdminById,
};
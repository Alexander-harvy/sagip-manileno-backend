const bcrypt = require("bcrypt");
const AdminModel = require("../models/adminModel");

const createAdmin = async (req, res) => {
  try {
    const { dept_id, first_name, last_name, contact_no, password } = req.body;

    if (!dept_id || !first_name || !last_name || !contact_no || !password) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: "dept_id, first_name, last_name, contact_no, and password are required",
      });
    }

    if (isNaN(dept_id)) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: "dept_id must be a valid number",
      });
    }

    const department = await AdminModel.getDepartmentById(dept_id);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Not found",
        error: "Department not found",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const adminId = await AdminModel.createAdmin({
      dept_id,
      first_name,
      last_name,
      contact_no,
      password: hashedPassword,
    });

    const newAdmin = await AdminModel.getAdminById(adminId);

    return res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: newAdmin,
    });
  } catch (error) {
    console.error("createAdmin error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const admins = await AdminModel.getAllAdmins();

    return res.status(200).json({
      success: true,
      message: "Admins retrieved successfully",
      data: admins,
    });
  } catch (error) {
    console.error("getAllAdmins error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: "Invalid admin ID",
      });
    }

    const admin = await AdminModel.getAdminById(id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Not found",
        error: "Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin retrieved successfully",
      data: admin,
    });
  } catch (error) {
    console.error("getAdminById error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
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

    const admin = await AdminModel.getAdminByContactNo(contact_no); 

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

    return res.status(200).json({
      success: true,
      message: "Admin logged in successfully",
      data: {
          admin_id: admin.admin_id,
          dept_id: admin.dept_id,
          first_name: admin.first_name,
          last_name: admin.last_name,
          contact_no: admin.contact_no,
    },
    });
  } catch (error) {
    console.error("loginAdmin error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
    }

module.exports = {
  createAdmin,
  getAllAdmins,
  getAdminById,
  loginAdmin,
};
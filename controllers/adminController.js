const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AdminModel = require("../models/adminModel");
const SubstationModel = require("../models/substationModel");

const bootstrapAdmin = async (req, res) => {
  try {
    const {
      dept_id,
      substation_id,
      username,
      email,
      first_name,
      last_name,
      contact_no,
      password,
      role,
    } = req.body;

    if (!dept_id || !username || !first_name || !last_name || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "dept_id, username, first_name, last_name, password, and role are required",
      });
    }

    const adminCount = await AdminModel.countAdmins();

    if (adminCount > 0) {
      return res.status(403).json({
        success: false,
        message: "Initial admin already exists",
      });
    }

    if (role === "SUBSTATION_ADMIN" && !substation_id) {
      return res.status(400).json({
        success: false,
        message: "substation_id is required for SUBSTATION_ADMIN",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await AdminModel.createAdmin({
      dept_id,
      substation_id: substation_id || null,
      username,
      email,
      first_name,
      last_name,
      contact_no,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      success: true,
      message: "Initial admin created successfully",
      data: {
        admin_id: result.insertId,
        dept_id,
        substation_id: substation_id || null,
        username,
        email: email || null,
        first_name,
        last_name,
        contact_no: contact_no || null,
        role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create initial admin",
      error: error.message,
    });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "username and password are required",
      });
    }

    const admin = await AdminModel.findByUsername(username);

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
        substation_id: admin.substation_id,
        username: admin.username,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      data: {
        admin_id: admin.admin_id,
        dept_id: admin.dept_id,
        substation_id: admin.substation_id,
        username: admin.username,
        email: admin.email,
        first_name: admin.first_name,
        last_name: admin.last_name,
        contact_no: admin.contact_no,
        role: admin.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to login admin",
      error: error.message,
    });
  }
};

const createAdmin = async (req, res) => {
  try {
    const {
      dept_id,
      substation_id,
      username,
      email,
      first_name,
      last_name,
      contact_no,
      password,
      role,
    } = req.body;

    if (!dept_id || !username || !first_name || !last_name || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "dept_id, username, first_name, last_name, password, and role are required",
      });
    }

    if (!["ERU_ADMIN", "SUBSTATION_ADMIN"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid admin role",
      });
    }

    if (role === "SUBSTATION_ADMIN") {
      if (!substation_id) {
        return res.status(400).json({
          success: false,
          message: "substation_id is required for SUBSTATION_ADMIN",
        });
      }

      const substation = await SubstationModel.getById(substation_id);

      if (!substation) {
        return res.status(404).json({
          success: false,
          message: "Substation not found",
        });
      }

      if (Number(substation.department_id) !== Number(dept_id)) {
        return res.status(400).json({
          success: false,
          message: "Substation does not belong to selected department",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await AdminModel.createAdmin({
      dept_id,
      substation_id: substation_id || null,
      username,
      email,
      first_name,
      last_name,
      contact_no,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: {
        admin_id: result.insertId,
        dept_id,
        substation_id: substation_id || null,
        username,
        email: email || null,
        first_name,
        last_name,
        contact_no: contact_no || null,
        role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create admin",
      error: error.message,
    });
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const admins = await AdminModel.getAllAdmins();

    return res.status(200).json({
      success: true,
      data: admins,
    });
  } catch (error) {
    return res.status(500).json({
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

    return res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    return res.status(500).json({
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
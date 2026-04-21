const DepartmentModel = require("../models/departmentModel");

const createDepartment = async (req, res) => {
  try {
    const { dept_name, dept_type, contact_no } = req.body;

    if (!dept_name) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: "dept_name is required",
      });
    }

    const existingDepartment = await DepartmentModel.getDepartmentByName(dept_name);

    if (existingDepartment) {
      return res.status(409).json({
        success: false,
        message: "Conflict",
        error: "Department already exists",
      });
    }

    const deptId = await DepartmentModel.createDepartment({
      dept_name,
      dept_type,
      contact_no,
    });

    const newDepartment = await DepartmentModel.getDepartmentById(deptId);

    return res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: newDepartment,
    });
  } catch (error) {
    console.error("createDepartment error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getAllDepartments = async (req, res) => {
  try {
    const departments = await DepartmentModel.getAllDepartments();

    return res.status(200).json({
      success: true,
      message: "Departments retrieved successfully",
      data: departments,
    });
  } catch (error) {
    console.error("getAllDepartments error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: "Invalid department ID",
      });
    }

    const department = await DepartmentModel.getDepartmentById(id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Not found",
        error: "Department not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Department retrieved successfully",
      data: department,
    });
  } catch (error) {
    console.error("getDepartmentById error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
};
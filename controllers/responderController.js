const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const ResponderModel = require("../models/responderModel");
const SubstationModel = require("../models/substationModel");

const createResponder = async (req, res) => {
  try {
    const {
      substation_id,
      employee_no,
      username,
      first_name,
      last_name,
      contact_no,
      password,
    } = req.body;

    const dept_id = req.user.dept_id;

    if (!substation_id || !employee_no || !first_name || !last_name || !password) {
      return res.status(400).json({
        success: false,
        message: "substation_id, employee_no, first_name, last_name, and password are required",
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await ResponderModel.createResponder({
      dept_id,
      substation_id,
      employee_no,
      username,
      first_name,
      last_name,
      contact_no,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Responder created successfully",
      data: {
        responder_id: result.insertId,
        dept_id,
        substation_id,
        employee_no,
        username: username || null,
        first_name,
        last_name,
        contact_no: contact_no || null,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create responder",
      error: error.message,
    });
  }
};

const getAllResponders = async (req, res) => {
  try {
    const responders = await ResponderModel.getAllResponders();

    return res.status(200).json({
      success: true,
      data: responders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch responders",
      error: error.message,
    });
  }
};

const getResponderById = async (req, res) => {
  try {
    const { id } = req.params;
    const responder = await ResponderModel.getResponderById(id);

    if (!responder) {
      return res.status(404).json({
        success: false,
        message: "Responder not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: responder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch responder",
      error: error.message,
    });
  }
};

const loginResponder = async (req, res) => {
  try {
    const { employee_no, password } = req.body;

    if (!employee_no || !password) {
      return res.status(400).json({
        success: false,
        message: "employee_no and password are required",
      });
    }

    const responder = await ResponderModel.getResponderByEmployeeNo(employee_no);

    if (!responder) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, responder.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: responder.responder_id,
        role: "responder",
        dept_id: responder.dept_id,
        substation_id: responder.substation_id,
        employee_no: responder.employee_no,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        responder: {
          responder_id: responder.responder_id,
          dept_id: responder.dept_id,
          substation_id: responder.substation_id,
          employee_no: responder.employee_no,
          username: responder.username,
          first_name: responder.first_name,
          last_name: responder.last_name,
          contact_no: responder.contact_no,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to login",
      error: error.message,
    });
  }
};

module.exports = {
  createResponder,
  getAllResponders,
  getResponderById,
  loginResponder,
};
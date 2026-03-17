const bcrypt = require("bcrypt");
const ResponderModel = require("../models/responderModel");

const createResponder = async (req, res) => {
  try {
    const { dept_id, first_name, last_name, contact_no, password } = req.body;

    if (!dept_id || !first_name || !last_name || !contact_no || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await ResponderModel.createResponder({
      dept_id,
      first_name,
      last_name,
      contact_no,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Responder created successfully",
      data: {
        responder_id: result.insertId,
        dept_id,
        first_name,
        last_name,
        contact_no,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create responder",
      error: error.message,
    });
  }
};
const getAllResponders = async (req, res) => {
  try {
    const responders = await ResponderModel.getAllResponders();

    res.status(200).json({
      success: true,
      data: responders,
    });
  } catch (error) {
    res.status(500).json({
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
    } else {
      res.status(200).json({
        success: true,
        data: responder,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch responder",
      error: error.message,
    });
  }
};

const loginResponder = async (req, res) => {
  try {
    const { contact_no, password } = req.body;

    if (!contact_no || !password) {
      return res.status(400).json({
        success: false,
        message: "contact_no and password are required",
      });
    }

    const responder = await ResponderModel.getResponderByContactNo(contact_no);

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

    return res.status(200).json({
  success: true,
  message: "Login successful",
  data: {
    responder_id: responder.responder_id,
    dept_id: responder.dept_id,
    first_name: responder.first_name,
    last_name: responder.last_name,
    contact_no: responder.contact_no,
  },
});

  } catch (error) {
    res.status(500).json({
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
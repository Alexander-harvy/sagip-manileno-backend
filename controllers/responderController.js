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

    const result = await ResponderModel.createResponder({
      dept_id,
      first_name,
      last_name,
      contact_no,
      password
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

module.exports = {
  createResponder,
  getAllResponders,
  getResponderById,
};
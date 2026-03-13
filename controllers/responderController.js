const ResponderModel = require("../models/responderModel");

const createResponder = async (req, res) => {
  try {
    console.log(req.body);
    const { dept_id, first_name, last_name, contact_no } = req.body;

    if (!dept_id || !first_name || !last_name || !contact_no) {
      return res.status(400).json({
        success: false,
        message: "dept_id, first_name, last_name, and contact_no are required",
      });
    }

    const result = await ResponderModel.createResponder({
      dept_id,
      first_name,
      last_name,
      contact_no,
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

module.exports = {
  createResponder,
  getAllResponders,
};
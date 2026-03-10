const ResponderModel = require("../models/responderModel");

const createResponder = async (req, res) => {
  try {
    const { user_id, department, availability_status } = req.body;

    if (!user_id || !department) {
      return res.status(400).json({
        success: false,
        message: "user_id and department are required",
      });
    }

    const result = await ResponderModel.createResponder({
      user_id,
      department,
      availability_status,
    });

    res.status(201).json({
      success: true,
      message: "Responder created successfully",
      data: {
        id: result.insertId,
        user_id,
        department,
        availability_status: availability_status || "available",
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
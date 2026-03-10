const IncidentModel = require("../models/incidentModel");

const createIncident = async (req, res) => {
  try {
    const {
      user_id,
      incident_type,
      description,
      latitude,
      longitude,
      address,
      status,
    } = req.body;

    if (!user_id || !incident_type || !description || !latitude || !longitude || !address) {
      return res.status(400).json({
        success: false,
        message: "user_id, incident_type, description, latitude, longitude, and address are required",
      });
    }

    const result = await IncidentModel.createIncident({
      user_id,
      incident_type,
      description,
      latitude,
      longitude,
      address,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Incident created successfully",
      data: {
        id: result.insertId,
        user_id,
        incident_type,
        description,
        latitude,
        longitude,
        address,
        status: status || "pending",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create incident",
      error: error.message,
    });
  }
};

const getAllIncidents = async (req, res) => {
  try {
    const incidents = await IncidentModel.getAllIncidents();

    res.status(200).json({
      success: true,
      data: incidents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch incidents",
      error: error.message,
    });
  }
};

module.exports = {
  createIncident,
  getAllIncidents,
};
const IncidentModel = require("../models/incidentModel");
const IncidentAssignmentModel = require("../models/incidentAssignmentModel");
const IncidentStatusModel = require("../models/incidentStatusModel");

// CREATE INCIDENT (from mobile/user)
const createIncident = async (req, res) => {
  try {
    const {
      user_id,
      incident_type,
      latitude,
      longitude,
      description,
      reported_at,
      source,
    } = req.body;

    if (!user_id || !incident_type || !description) {
      return res.status(400).json({
        success: false,
        message: "user_id, incident_type, and description are required",
      });
    }

    const result = await IncidentModel.createIncident({
      user_id,
      incident_type,
      latitude: latitude ?? null,
      longitude: longitude ?? null,
      description,
      reported_at: reported_at || new Date(),
      source: source || "mobile_app",
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Create Incident Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create incident",
    });
  }
};

// ASSIGN SUBSTATION (ERU ACTION)
const assignIncident = async (req, res) => {
  try {
    const { incident_id, substation_id } = req.body;

    if (!incident_id || !substation_id) {
      return res.status(400).json({
        success: false,
        message: "incident_id and substation_id are required",
      });
    }

    await IncidentAssignmentModel.createAssignment({
      incident_id,
      substation_id,
    });

    res.json({
      success: true,
      message: "Substation assigned successfully",
    });
  } catch (error) {
    console.error("Assign Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET ALL INCIDENTS
const getAllIncidents = async (req, res) => {
  try {
    const incidents = await IncidentModel.getAllIncidents();

    res.json({
      success: true,
      data: incidents,
    });
  } catch (error) {
    console.error("Get Incidents Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch incidents",
    });
  }
};

module.exports = {
  createIncident,
  assignIncident,
  getAllIncidents,
};
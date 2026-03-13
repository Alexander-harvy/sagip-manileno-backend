const IncidentModel = require("../models/incidentModel");
const IncidentAssignmentModel = require("../models/incidentAssignmentModel");
const IncidentStatusModel = require("../models/incidentStatusModel");

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

    res.status(201).json({
      success: true,
      message: "Incident created successfully",
      data: {
        incident_id: result.insertId,
        user_id,
        incident_type,
        latitude,
        longitude,
        description,
        source: source || "mobile_app",
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


const assignResponder = async (req, res) => {
  try {
    const incident_id = req.params.id;
    const { responder_id, admin_id } = req.body;

    if (!responder_id || !admin_id) {
      return res.status(400).json({
        success: false,
        message: "responder_id and admin_id are required",
      });
    }

    const result = await IncidentAssignmentModel.createAssignment({
      incident_id,
      responder_id,
      admin_id,
      assigned_at: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Responder assigned successfully",
      data: {
        assign_id: result.insertId,
        incident_id: Number(incident_id),
        responder_id,
        admin_id,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to assign responder",
      error: error.message,
    });
  }
};

const getIncidentAssignments = async (req, res) => {
  try {
    const incident_id = req.params.id;
    const assignments = await IncidentAssignmentModel.getAssignmentsByIncidentId(incident_id);

    res.status(200).json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch assignments",
      error: error.message,
    });
  }
};

const getIncidentById = async (req, res) => {
  try {
    const incident_id = req.params.id;
    const incident = await IncidentModel.getIncidentById(incident_id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "Incident not found",
      });
    }

    res.status(200).json({
      success: true,
      data: incident,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch incident",
      error: error.message,
    });
  }
};

const updateIncidentStatus = async (req, res) => {
  try {
    const incident_id = req.params.id;
    const { responder_id, status } = req.body;

    if (!responder_id || !status) {
      return res.status(400).json({
        success: false,
        message: "responder_id and status are required",
      });
    }

    const result = await IncidentStatusModel.createStatus({
      incident_id,
      responder_id,
      status,
      timestamp: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Incident status updated successfully",
      data: {
        status_log_id: result.insertId,
        incident_id: Number(incident_id),
        responder_id,
        status,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update incident status",
      error: error.message,
    });
  }
};

const getIncidentStatuses = async (req, res) => {
  try {
    const incident_id = req.params.id;
    const statuses = await IncidentStatusModel.getStatusesByIncidentId(incident_id);

    res.status(200).json({
      success: true,
      data: statuses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch incident statuses",
      error: error.message,
    });
  }
};

module.exports = {
  createIncident,
  getAllIncidents,
  getIncidentById,
  assignResponder,
  getIncidentAssignments,
  updateIncidentStatus,
  getIncidentStatuses,
};
  
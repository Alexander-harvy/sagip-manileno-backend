const IncidentModel = require("../models/incidentModel");
const IncidentAssignmentModel = require("../models/incidentAssignmentModel");
const IncidentStatusModel = require("../models/incidentStatusModel");
const SubstationModel = require("../models/substationModel");

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

    return res.status(201).json({
      success: true,
      message: "Incident created successfully",
      data: {
        incident_id: result.insertId,
        user_id,
        incident_type,
        latitude: latitude ?? null,
        longitude: longitude ?? null,
        description,
        reported_at: reported_at || new Date(),
        source: source || "mobile_app",
      },
    });
  } catch (error) {
    console.error("Create Incident Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create incident",
    });
  }
};

// ASSIGN SUBSTATION (ERU ACTION)
const assignIncident = async (req, res) => {
  try {
    const { incident_id, substation_id } = req.body;
    const admin_id = req.user.admin_id;
    const department_id = req.user.dept_id;

    if (!incident_id || !substation_id) {
      return res.status(400).json({
        success: false,
        message: "incident_id and substation_id are required",
      });
    }

    if (isNaN(Number(incident_id)) || isNaN(Number(substation_id))) {
      return res.status(400).json({
        success: false,
        message: "incident_id and substation_id must be valid numbers",
      });
    }

    const incident = await IncidentModel.getIncidentById(incident_id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "Incident not found",
      });
    }

    const substation = await SubstationModel.getById(substation_id);

    if (!substation) {
      return res.status(404).json({
        success: false,
        message: "Substation not found",
      });
    }

    if (Number(substation.department_id) !== Number(department_id)) {
      return res.status(403).json({
        success: false,
        message: "Selected substation does not belong to your department",
      });
    }

    if (Number(substation.is_active) !== 1) {
      return res.status(400).json({
        success: false,
        message: "Selected substation is inactive",
      });
    }

    const existingAssignments =
      await IncidentAssignmentModel.getAssignmentsByIncidentId(incident_id);

    if (existingAssignments.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Incident already assigned",
      });
    }

    await IncidentAssignmentModel.createAssignment({
      incident_id,
      responder_id: null,
      admin_id,
      substation_id,
    });

    await IncidentStatusModel.createStatus({
      incident_id,
      responder_id: null,
      status: "assigned_to_substation",
      timestamp: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Incident assigned to substation successfully",
      data: {
        incident_id: Number(incident_id),
        incident_type: incident.incident_type,
        description: incident.description,
        substation_id: Number(substation_id),
        substation_name: substation.substation_name,
        substation_address: substation.address,
        status: "assigned_to_substation",
      },
    });
  } catch (error) {
    console.error("Assign Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET ALL INCIDENTS
const getAllIncidents = async (req, res) => {
  try {
    const incidents = await IncidentModel.getAllIncidents();

    return res.status(200).json({
      success: true,
      data: incidents,
    });
  } catch (error) {
    console.error("Get Incidents Error:", error);
    return res.status(500).json({
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
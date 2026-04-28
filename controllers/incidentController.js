const IncidentModel = require("../models/incidentModel");
const IncidentAssignmentModel = require("../models/incidentAssignmentModel");
const IncidentStatusModel = require("../models/incidentStatusModel");
const SubstationModel = require("../models/substationModel");
const DepartmentModel = require("../models/departmentModel");

const isIncidentAllowedForDepartment = (incidentType, deptType) => {
  const incident = String(incidentType).toLowerCase();
  const dept = String(deptType).toLowerCase();

  if (dept === "medical") {
    return incident === "medical" || incident === "medic";
  }

  return incident === dept;
};

// CREATE INCIDENT (from mobile/user)
const createIncident = async (req, res) => {
  try {
    const {
      user_id,
      incident_type,
      latitude,
      longitude,
      location_name,
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

    const finalReportedAt = reported_at || new Date();
    const finalSource = source || "api";

    const result = await IncidentModel.createIncident({
      user_id,
      incident_type,
      latitude: latitude ?? null,
      longitude: longitude ?? null,
      location_name: location_name ?? null,
      description,
      reported_at: finalReportedAt,
      source: finalSource,
    });

    await IncidentStatusModel.createStatus({
      incident_id: result.insertId,
      responder_id: null,
      status: "pending",
      timestamp: new Date(),
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
        location_name: location_name ?? null,
        description,
        reported_at: finalReportedAt,
        source: finalSource,
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
        location_name: incident.location_name ?? null,
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

  const department = await DepartmentModel.getDepartmentById(department_id);

if (!department) {
  return res.status(404).json({
    success: false,
    message: "Department not found",
  });
}

if (!isIncidentAllowedForDepartment(incident.incident_type, department.dept_type)) {
  return res.status(403).json({
    success: false,
    message: "You are not allowed to assign this incident type",
    });
  }
};

const updateIncidentStatus = async (req, res) => {
  try {
    const { incident_id, status, responder_id } = req.body;

    if (!incident_id || !status) {
      return res.status(400).json({
        success: false,
        message: "incident_id and status are required",
      });
    }

    if (isNaN(Number(incident_id))) {
      return res.status(400).json({
        success: false,
        message: "incident_id must be a valid number",
      });
    }

    const incident = await IncidentModel.getIncidentById(incident_id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "Incident not found",
      });
    }

    const allowedStatuses = [
      "assigned_to_substation",
      "responder_assigned",
      "en_route",
      "on_scene",
      "resolved",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const responderRequiredStatuses = [
      "responder_assigned",
      "en_route",
      "on_scene",
      "resolved",
    ];

    if (responderRequiredStatuses.includes(status)) {
      if (!responder_id) {
        return res.status(400).json({
          success: false,
          message: "responder_id is required for this status",
        });
      }

      if (isNaN(Number(responder_id))) {
        return res.status(400).json({
          success: false,
          message: "responder_id must be a valid number",
        });
      }
    }

    await IncidentStatusModel.createStatus({
      incident_id: Number(incident_id),
      responder_id: responder_id ? Number(responder_id) : null,
      status,
      timestamp: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: {
        incident_id: Number(incident_id),
        responder_id: responder_id ? Number(responder_id) : null,
        status,
      },
    });
  } catch (error) {
    console.error("Update Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET ALL INCIDENTS
const getAllIncidents = async (req, res) => {
  try {
    const incidents = await IncidentModel.getAllIncidents({
  dept_id: req.user.dept_id,
  substation_id: req.user.substation_id,
  role: req.user.role,
  });

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
  updateIncidentStatus,
  getAllIncidents,
};
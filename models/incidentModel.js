const db = require("../config/db");

const IncidentModel = {
  async createIncident(incidentData) {
    const {
      user_id,
      incident_type,
      description,
      latitude,
      longitude,
      address,
      status,
    } = incidentData;

    const sql = `
      INSERT INTO incidents (
        user_id,
        incident_type,
        description,
        latitude,
        longitude,
        address,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
      user_id,
      incident_type,
      description,
      latitude,
      longitude,
      address,
      status || "pending",
    ]);

    return result;
  },

  async getAllIncidents() {
    const sql = `
      SELECT * FROM incidents
      ORDER BY id DESC
    `;

    const [rows] = await db.execute(sql);
    return rows;
  },
};

module.exports = IncidentModel;
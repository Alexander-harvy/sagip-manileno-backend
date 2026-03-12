const db = require("../config/db");

const IncidentModel = {
  async createIncident(incidentData) {
    const {
      user_id,
      incident_type,
      latitude,
      longitude,
      description,
      reported_at,
      source,
    } = incidentData;

    const sql = `
      INSERT INTO incident (
        user_id,
        incident_type,
        latitude,
        longitude,
        description,
        reported_at,
        source
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
      user_id,
      incident_type,
      latitude,
      longitude,
      description,
      reported_at,
      source,
    ]);

    return result;
  },

  async getAllIncidents() {
    const sql = `
      SELECT 
        i.incident_id,
        i.user_id,
        u.first_name,
        u.last_name,
        i.incident_type,
        i.latitude,
        i.longitude,
        i.description,
        i.reported_at,
        i.source
      FROM incident i
      JOIN users u ON i.user_id = u.user_id
      ORDER BY i.incident_id DESC
    `;

    const [rows] = await db.execute(sql);
    return rows;
  },
};

module.exports = IncidentModel;
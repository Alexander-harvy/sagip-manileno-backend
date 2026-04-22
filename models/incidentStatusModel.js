const db = require("../config/db");

const IncidentStatusModel = {
  async createStatus(data) {
    const { incident_id, responder_id, status, timestamp } = data;

    const sql = `
      INSERT INTO incident_status (incident_id, responder_id, status, timestamp)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
      incident_id,
      responder_id,
      status,
      timestamp,
    ]);

    return result;
  },

async getStatusesByIncidentId(incident_id) {
  const sql = `
    SELECT
      s.status_log_id,
      s.incident_id,
      s.responder_id,
      r.first_name,
      r.last_name,
      s.status,
      s.timestamp
    FROM incident_status s
    LEFT JOIN responder r ON s.responder_id = r.responder_id
    WHERE s.incident_id = ?
    ORDER BY s.timestamp DESC
  `;

  const [rows] = await db.execute(sql, [incident_id]);
  return rows;
}
};

module.exports = IncidentStatusModel;
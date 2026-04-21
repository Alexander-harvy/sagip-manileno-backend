const db = require("../config/db");

const IncidentAssignmentModel = {
  async createAssignment(data) {
    const {
      incident_id,
      responder_id,
      admin_id,
      assigned_at,
      substation_id,
    } = data;

    const sql = `
      INSERT INTO incident_assignment 
      (incident_id, responder_id, admin_id, assigned_at, substation_id)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
      incident_id,
      responder_id || null,
      admin_id || null,
      assigned_at || new Date(),
      substation_id || null,
    ]);

    return result;
  },

  async getAssignmentsByIncidentId(incident_id) {
    const sql = `
      SELECT
        ia.assign_id,
        ia.incident_id,
        ia.responder_id,
        r.first_name AS responder_first_name,
        r.last_name AS responder_last_name,
        ia.admin_id,
        a.first_name AS admin_first_name,
        a.last_name AS admin_last_name,
        ia.assigned_at,
        ia.substation_id
      FROM incident_assignment ia
      LEFT JOIN responder r ON ia.responder_id = r.responder_id
      LEFT JOIN emergency_unit_admin a ON ia.admin_id = a.admin_id
      WHERE ia.incident_id = ?
      ORDER BY ia.assign_id DESC
    `;

    const [rows] = await db.execute(sql, [incident_id]);
    return rows;
  },

  async getAllAssignments() {
  const sql = `
    SELECT 
      ia.assign_id,
      ia.incident_id,
      ia.substation_id,
      s.substation_name,
      ia.admin_id,
      ia.assigned_at
    FROM incident_assignment ia
    LEFT JOIN substation s 
      ON ia.substation_id = s.substation_id
    ORDER BY ia.assign_id DESC
  `;

  const [rows] = await db.execute(sql);
  return rows;
}

};

module.exports = IncidentAssignmentModel;
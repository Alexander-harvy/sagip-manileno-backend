const db = require("../config/db");

const IncidentModel = {
  async createIncident(incidentData) {
    const {
      user_id,
      incident_type,
      latitude,
      longitude,
      location_name,
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
        location_name,
        description,
        reported_at,
        source
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
      user_id,
      incident_type,
      latitude,
      longitude,
      location_name,
      description,
      reported_at,
      source,
    ]);

    return result;
  },

  async getAllIncidents({ dept_id, substation_id, role }) {
    const sql = `
  SELECT 
    i.incident_id,
    i.user_id,
    u.first_name,
    u.last_name,
    i.incident_type,
    i.latitude,
    i.longitude,
    i.location_name,
    i.description,
    i.reported_at,
    i.source,

    ia.assign_id,
    ia.substation_id,
    s.substation_name,
    s.address AS substation_address,
    ia.admin_id,
    ia.assigned_at,

    st.responder_id AS responder_id,
    st.status,
    st.timestamp AS status_timestamp

  FROM incident i
  JOIN users u ON i.user_id = u.user_id
  JOIN department d ON d.dept_id = ?

  LEFT JOIN (
    SELECT ia1.*
    FROM incident_assignment ia1
    INNER JOIN (
      SELECT incident_id, MAX(assign_id) AS latest_assign_id
      FROM incident_assignment
      GROUP BY incident_id
    ) latest
    ON ia1.assign_id = latest.latest_assign_id
  ) ia ON ia.incident_id = i.incident_id

  LEFT JOIN substation s ON ia.substation_id = s.substation_id

  LEFT JOIN (
    SELECT s1.*
    FROM incident_status s1
    INNER JOIN (
      SELECT incident_id, MAX(status_log_id) AS latest_status_id
      FROM incident_status
      GROUP BY incident_id
    ) latest_status
    ON s1.status_log_id = latest_status.latest_status_id
  ) st ON st.incident_id = i.incident_id

  WHERE (
    LOWER(i.incident_type) = LOWER(d.dept_type)
    OR (
      LOWER(d.dept_type) = 'medical'
      AND LOWER(i.incident_type) IN ('medical', 'medic')
    )
  )
  AND (
    ? = 'ERU_ADMIN'
    OR ia.substation_id = ?
  )

  ORDER BY i.incident_id DESC
`;

const [rows] = await db.execute(sql, [dept_id, role, substation_id]);
return rows;
  },

  async getIncidentById(incident_id) {
    const sql = `
      SELECT incident_id, incident_type, description, location_name
      FROM incident
      WHERE incident_id = ?
      LIMIT 1
    `;

    const [rows] = await db.execute(sql, [incident_id]);
    return rows[0];
  },
};

module.exports = IncidentModel;
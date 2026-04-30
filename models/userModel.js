const db = require("../config/db");

const UserModel = {
  async createUser(userData) {
    const { first_name, last_name, contact_no, password } = userData;

    const sql = `
      INSERT INTO users (first_name, last_name, contact_no, password)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
      first_name,
      last_name,
      contact_no,
      password,
    ]);

    return result;
  },

  async getAllUsers() {
    const sql = `
      SELECT user_id, first_name, last_name, contact_no
      FROM users
      ORDER BY user_id DESC
    `;

    const [rows] = await db.execute(sql);
    return rows;
  },

  async getUserById(id) {
    const sql = `
      SELECT user_id, first_name, last_name, contact_no
      FROM users
      WHERE user_id = ?
    `;

    const [rows] = await db.execute(sql, [id]);
    return rows[0];
  },

  async getUserByContactNo(contact_no) {
  const [rows] = await db.execute(
    `SELECT * FROM users WHERE contact_no = ?`,
    [contact_no]
  );
  return rows[0];
},

  async getIncidentsByUserId(user_id) {
  const sql = `
    SELECT
      i.incident_id,
      i.user_id,
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
      ia.responder_id,
      r.first_name AS responder_first_name,
      r.last_name AS responder_last_name,
      ia.assigned_at,

      st.status AS latest_status,
      st.timestamp AS status_timestamp

    FROM incident i

    LEFT JOIN (
      SELECT ia1.*
      FROM incident_assignment ia1
      INNER JOIN (
        SELECT incident_id, MAX(assign_id) AS latest_assign_id
        FROM incident_assignment
        GROUP BY incident_id
      ) latest_assignment
      ON ia1.assign_id = latest_assignment.latest_assign_id
    ) ia ON ia.incident_id = i.incident_id

    LEFT JOIN substation s ON ia.substation_id = s.substation_id
    LEFT JOIN responder r ON ia.responder_id = r.responder_id

    LEFT JOIN (
      SELECT st1.*
      FROM incident_status st1
      INNER JOIN (
        SELECT incident_id, MAX(status_log_id) AS latest_status_id
        FROM incident_status
        GROUP BY incident_id
      ) latest_status
      ON st1.status_log_id = latest_status.latest_status_id
    ) st ON st.incident_id = i.incident_id

    WHERE i.user_id = ?
    ORDER BY i.incident_id DESC
  `;

  const [rows] = await db.execute(sql, [user_id]);
  return rows;
}

};
module.exports = UserModel;
const db = require("../config/db");

const ResponderModel = {
  async createResponder(data) {
    const {
      dept_id,
      substation_id,
      employee_no,
      username,
      first_name,
      last_name,
      contact_no,
      password,
    } = data;

    const sql = `
      INSERT INTO responder
      (dept_id, substation_id, employee_no, username, first_name, last_name, contact_no, password)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
      dept_id,
      substation_id,
      employee_no,
      username || null,
      first_name,
      last_name,
      contact_no || null,
      password,
    ]);

    return result;
  },

  async getAllResponders({ role, dept_id, substation_id }) {
  let sql = `
    SELECT 
      r.responder_id,
      r.dept_id,
      d.dept_name,
      d.dept_type,
      r.substation_id,
      s.substation_name,
      s.address,
      r.employee_no,
      r.username,
      r.first_name,
      r.last_name,
      r.contact_no,
      r.team_leader_id,  
      r.is_team_leader  
    FROM responder r
    JOIN department d ON r.dept_id = d.dept_id
    JOIN substation s ON r.substation_id = s.substation_id
    WHERE r.dept_id = ?
    AND r.is_team_leader = 1
  `;

  const params = [dept_id];

  if (role === "SUBSTATION_ADMIN") {
    sql += ` AND r.substation_id = ?`;
    params.push(substation_id);
  }

  sql += ` ORDER BY r.responder_id DESC`;

  const [rows] = await db.execute(sql, params);
  return rows;
},

  async getResponderById(responder_id) {
    const sql = `
      SELECT 
        r.responder_id,
        r.dept_id,
        d.dept_name,
        d.dept_type,
        r.substation_id,
        s.substation_name,
        r.employee_no,
        r.username,
        r.first_name,
        r.last_name,
        r.contact_no,
        r.team_leader_id,   
        r.is_team_leader  
      FROM responder r
      JOIN department d ON r.dept_id = d.dept_id
      JOIN substation s ON r.substation_id = s.substation_id
      WHERE r.responder_id = ?
    `;

    const [rows] = await db.execute(sql, [responder_id]);
    return rows[0];
  },

  async getResponderByEmployeeNo(employee_no) {
    const sql = `
      SELECT *
      FROM responder
      WHERE employee_no = ?
      LIMIT 1
    `;

    const [rows] = await db.execute(sql, [employee_no]);
    return rows[0];
  },

   async getMembersByTeamLeader(team_leader_id) {
    const sql = `
      SELECT 
        responder_id,
        employee_no,
        username,
        first_name,
        last_name,
        contact_no
      FROM responder
      WHERE team_leader_id = ?
    `;
    const [rows] = await db.execute(sql, [team_leader_id]);
    return rows;
  },

  async getAssignedIncidents(responder_id) {
  const sql = `
    SELECT 
      i.incident_id,
      i.user_id,
      u.first_name AS user_first_name,
      u.last_name AS user_last_name,
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
      ia.assigned_at,

      st.status,
      st.timestamp AS status_timestamp

    FROM incident_assignment ia
    JOIN incident i ON ia.incident_id = i.incident_id
    JOIN users u ON i.user_id = u.user_id
    JOIN substation s ON ia.substation_id = s.substation_id

    LEFT JOIN (
      SELECT st1.*
      FROM incident_status st1
      INNER JOIN (
        SELECT incident_id, MAX(status_log_id) AS latest_status_id
        FROM incident_status
        GROUP BY incident_id
      ) latest
      ON st1.status_log_id = latest.latest_status_id
    ) st ON st.incident_id = i.incident_id

    WHERE ia.responder_id = ?
    ORDER BY ia.assigned_at DESC
  `;

  const [rows] = await db.execute(sql, [responder_id]);
  return rows;
  },

};

module.exports = ResponderModel;
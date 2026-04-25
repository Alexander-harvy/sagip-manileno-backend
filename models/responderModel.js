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

  async getAllResponders() {
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
        r.contact_no
      FROM responder r
      JOIN department d ON r.dept_id = d.dept_id
      JOIN substation s ON r.substation_id = s.substation_id
      ORDER BY r.responder_id DESC
    `;

    const [rows] = await db.execute(sql);
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
        r.contact_no
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
};

module.exports = ResponderModel;
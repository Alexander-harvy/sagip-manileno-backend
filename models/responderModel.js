const db = require("../config/db");

const ResponderModel = {
  async createResponder(data) {
    const { dept_id, first_name, last_name, contact_no } = data;

    const sql = `
      INSERT INTO responder (dept_id, first_name, last_name, contact_no)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
      dept_id,
      first_name,
      last_name,
      contact_no,
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
        r.first_name,
        r.last_name,
        r.contact_no
      FROM responder r
      JOIN department d ON r.dept_id = d.dept_id
      ORDER BY r.responder_id DESC
    `;

    const [rows] = await db.execute(sql);
    return rows;
  },
};

module.exports = ResponderModel;
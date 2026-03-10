const db = require("../config/db");

const ResponderModel = {
  async createResponder(responderData) {
    const { user_id, department, availability_status } = responderData;

    const sql = `
      INSERT INTO responders (user_id, department, availability_status)
      VALUES (?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
      user_id,
      department,
      availability_status || "available",
    ]);

    return result;
  },

  async getAllResponders() {
    const sql = `
      SELECT r.id, r.user_id, u.full_name, u.email, u.phone, r.department, r.availability_status
      FROM responders r
      JOIN users u ON r.user_id = u.id
      ORDER BY r.id DESC
    `;

    const [rows] = await db.execute(sql);
    return rows;
  },
};

module.exports = ResponderModel;
const db = require("../config/db");

const AdminModel = {
  async countAdmins() {
    const sql = "SELECT COUNT(*) AS total FROM emergency_unit_admin";
    const [rows] = await db.execute(sql);
    return rows[0].total;
  },

async createAdmin(data) {
  const { dept_id, first_name, last_name, contact_no, password, role } = data;

  const sql = `
    INSERT INTO emergency_unit_admin
    (dept_id, first_name, last_name, contact_no, password, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.execute(sql, [
    dept_id,
    first_name,
    last_name,
    contact_no,
    password,
    role || "SUBSTATION_ADMIN",
  ]);

  return result;
},

  async findByContactNo(contact_no) {
    const sql = `
      SELECT *
      FROM emergency_unit_admin
      WHERE contact_no = ?
      LIMIT 1
    `;

    const [rows] = await db.execute(sql, [contact_no]);
    return rows[0];
  },

  async getAllAdmins() {
    const sql = `
      SELECT admin_id, dept_id, first_name, last_name, contact_no, role
      FROM emergency_unit_admin
      ORDER BY admin_id DESC
    `;
    const [rows] = await db.execute(sql);
    return rows;
  },

  async getAdminById(admin_id) {
    const sql = `
      SELECT admin_id, dept_id, first_name, last_name, contact_no
      FROM emergency_unit_admin
      WHERE admin_id = ?
    `;
    const [rows] = await db.execute(sql, [admin_id]);
    return rows[0];
  },
};

module.exports = AdminModel;
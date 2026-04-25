const db = require("../config/db");

const AdminModel = {
  async countAdmins() {
    const sql = "SELECT COUNT(*) AS total FROM emergency_unit_admin";
    const [rows] = await db.execute(sql);
    return rows[0].total;
  },

  async createAdmin(data) {
    const {
      dept_id,
      substation_id,
      username,
      email,
      first_name,
      last_name,
      contact_no,
      password,
      role,
    } = data;

    const sql = `
      INSERT INTO emergency_unit_admin
      (dept_id, substation_id, username, email, first_name, last_name, contact_no, password, role)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
      dept_id,
      substation_id || null,
      username,
      email || null,
      first_name,
      last_name,
      contact_no || null,
      password,
      role,
    ]);

    return result;
  },

  async findByUsername(username) {
    const sql = `
      SELECT *
      FROM emergency_unit_admin
      WHERE username = ?
      LIMIT 1
    `;

    const [rows] = await db.execute(sql, [username]);
    return rows[0];
  },

  async getAllAdmins() {
    const sql = `
      SELECT 
        a.admin_id,
        a.dept_id,
        d.dept_name,
        a.substation_id,
        s.substation_name,
        a.username,
        a.email,
        a.first_name,
        a.last_name,
        a.contact_no,
        a.role
      FROM emergency_unit_admin a
      LEFT JOIN department d ON a.dept_id = d.dept_id
      LEFT JOIN substation s ON a.substation_id = s.substation_id
      ORDER BY a.admin_id DESC
    `;

    const [rows] = await db.execute(sql);
    return rows;
  },

  async getAdminById(admin_id) {
    const sql = `
      SELECT 
        a.admin_id,
        a.dept_id,
        d.dept_name,
        a.substation_id,
        s.substation_name,
        a.username,
        a.email,
        a.first_name,
        a.last_name,
        a.contact_no,
        a.role
      FROM emergency_unit_admin a
      LEFT JOIN department d ON a.dept_id = d.dept_id
      LEFT JOIN substation s ON a.substation_id = s.substation_id
      WHERE a.admin_id = ?
    `;

    const [rows] = await db.execute(sql, [admin_id]);
    return rows[0];
  },
};

module.exports = AdminModel;
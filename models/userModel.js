const db = require("../config/db");

const UserModel = {
  async createUser(userData) {
    const { full_name, email, phone, role } = userData;

    const sql = `
      INSERT INTO users (full_name, email, phone, role)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [full_name, email, phone, role]);
    return result;
  },

  async getAllUsers() {
    const sql = `SELECT * FROM users ORDER BY id DESC`;
    const [rows] = await db.execute(sql);
    return rows;
  },
};

module.exports = UserModel;
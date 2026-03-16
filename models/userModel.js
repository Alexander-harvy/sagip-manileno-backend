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

};


module.exports = UserModel;
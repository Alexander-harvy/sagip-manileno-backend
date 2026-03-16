const db = require("../config/db");

const createAdmin = async ({ dept_id, first_name, last_name, contact_no, password }) => {
  const [result] = await db.execute(
    `INSERT INTO emergency_unit_admin 
      (dept_id, first_name, last_name, contact_no, password)
     VALUES (?, ?, ?, ?, ?)`,
    [dept_id, first_name, last_name, contact_no, password]
  );

  return result.insertId;
};

const getAllAdmins = async () => {
  const [rows] = await db.execute(
    `SELECT 
        a.admin_id,
        a.dept_id,
        d.dept_name,
        d.dept_type,
        a.first_name,
        a.last_name,
        a.contact_no
     FROM emergency_unit_admin a
     INNER JOIN department d ON a.dept_id = d.dept_id
     ORDER BY a.admin_id DESC`
  );

  return rows;
};

const getAdminById = async (admin_id) => {
  const [rows] = await db.execute(
    `SELECT 
        a.admin_id,
        a.dept_id,
        d.dept_name,
        d.dept_type,
        a.first_name,
        a.last_name,
        a.contact_no
     FROM emergency_unit_admin a
     INNER JOIN department d ON a.dept_id = d.dept_id
     WHERE a.admin_id = ?`,
    [admin_id]
  );

  return rows[0];
};

const getDepartmentById = async (dept_id) => {
  const [rows] = await db.execute(
    `SELECT * FROM department WHERE dept_id = ?`,
    [dept_id]
  );

  return rows[0];
};

module.exports = {
  createAdmin,
  getAllAdmins,
  getAdminById,
  getDepartmentById,
};
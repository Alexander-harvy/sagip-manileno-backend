const db = require("../config/db");

const createDepartment = async ({ dept_name, dept_type, contact_no }) => {
  const [result] = await db.execute(
    `INSERT INTO department (dept_name, dept_type, contact_no)
     VALUES (?, ?, ?)`,
    [dept_name, dept_type || null, contact_no || null]
  );

  return result.insertId;
};

const getAllDepartments = async () => {
  const [rows] = await db.execute(
    `SELECT dept_id, dept_name, dept_type, contact_no
     FROM department
     ORDER BY dept_id DESC`
  );

  return rows;
};

const getDepartmentById = async (dept_id) => {
  const [rows] = await db.execute(
    `SELECT dept_id, dept_name, dept_type, contact_no
     FROM department
     WHERE dept_id = ?`,
    [dept_id]
  );

  return rows[0];
};

const getDepartmentByName = async (dept_name) => {
  const [rows] = await db.execute(
    `SELECT * FROM department WHERE dept_name = ?`,
    [dept_name]
  );

  return rows[0];
};

module.exports = {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  getDepartmentByName,
};
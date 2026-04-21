const db = require("../config/db");

const SubstationModel = {
  async getByDepartmentId(department_id) {
    const sql = `
      SELECT
        substation_id,
        department_id,
        substation_name,
        address,
        is_active
      FROM substation
      WHERE department_id = ?
        AND is_active = 1
      ORDER BY substation_name ASC
    `;

    const [rows] = await db.execute(sql, [department_id]);
    return rows;
  },

  async getById(substation_id) {
    const sql = `
      SELECT
        substation_id,
        department_id,
        substation_name,
        address,
        is_active
      FROM substation
      WHERE substation_id = ?
      LIMIT 1
    `;

    const [rows] = await db.execute(sql, [substation_id]);
    return rows[0];
  },
};

module.exports = SubstationModel;
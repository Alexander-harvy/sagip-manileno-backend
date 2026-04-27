const db = require("../config/db");

const SubstationModel = {
  async createSubstation(data) {
    const { department_id, substation_name, address, latitude, longitude } = data;

    const sql = `
      INSERT INTO substation
      (department_id, substation_name, address, latitude, longitude, is_active)
      VALUES (?, ?, ?, ?, ?, 1)
    `;

    const [result] = await db.execute(sql, [
      department_id,
      substation_name,
      address || null,
      latitude || null,
      longitude || null,
    ]);

    return result;
  },

  async getByDepartmentId(department_id) {
    const sql = `
      SELECT
        substation_id,
        department_id,
        substation_name,
        address,
        latitude,
        longitude,
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
        latitude,
        longitude,
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
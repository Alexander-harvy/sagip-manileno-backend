const SubstationModel = require("../models/substationModel");

const createSubstation = async (req, res) => {
  try {
    const department_id = req.user.dept_id;
    const { substation_name, address, latitude, longitude } = req.body;

    if (!substation_name) {
      return res.status(400).json({
        success: false,
        message: "substation_name is required",
      });
    }

    const result = await SubstationModel.createSubstation({
      department_id,
      substation_name,
      address,
      latitude,
      longitude,
    });

    return res.status(201).json({
      success: true,
      message: "Substation created successfully",
      data: {
        substation_id: result.insertId,
        department_id,
        substation_name,
        address: address || null,
        latitude: latitude || null,
        longitude: longitude || null,
        is_active: 1,
      },
    });
  } catch (error) {
    console.error("createSubstation error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create substation",
      error: error.message,
    });
  }
};

const getSubstations = async (req, res) => {
  try {
    const department_id = req.user.dept_id;

    const substations = await SubstationModel.getByDepartmentId(department_id);

    return res.status(200).json({
      success: true,
      message: "Substations retrieved successfully",
      data: substations,
    });
  } catch (error) {
    console.error("getSubstations error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch substations",
      error: error.message,
    });
  }
};

module.exports = {
  createSubstation,
  getSubstations,
};
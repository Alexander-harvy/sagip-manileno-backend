const SubstationModel = require("../models/substationModel");

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
  getSubstations,
};
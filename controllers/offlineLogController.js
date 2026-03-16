const OfflineLogModel = require("../models/offlinelogModel");

const createOfflineLog = async (req, res) => {
  try {
    const { sender_no, message_cont, receive_at, latitude, longitude } = req.body;

    if (!sender_no || !message_cont) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: "sender_no and message_cont are required",
      });
    }

    const offlineLogId = await OfflineLogModel.createOfflineLog({
      sender_no,
      message_cont,
      receive_at,
      latitude,
      longitude,
    });

    return res.status(201).json({
      success: true,
      message: "Offline log created successfully",
      data: {
        offlineLog_id: offlineLogId,
      },
    });
  } catch (error) {
    console.error("createOfflineLog error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getAllOfflineLogs = async (req, res) => {
  try {
    const logs = await OfflineLogModel.getAllOfflineLogs();

    return res.status(200).json({
      success: true,
      message: "Offline logs retrieved successfully",
      data: logs,
    });
  } catch (error) {
    console.error("getAllOfflineLogs error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createOfflineLog,
  getAllOfflineLogs,
};
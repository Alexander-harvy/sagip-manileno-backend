const db = require("../config/db");

const createOfflineLog = async ({ sender_no, message_cont, receive_at, latitude, longitude }) => {
  const [result] = await db.execute(
    `INSERT INTO offline_log (sender_no, message_cont, receive_at, latitude, longitude)
     VALUES (?, ?, ?, ?, ?)`,
    [sender_no || null, message_cont || null, receive_at || new Date(), latitude || null, longitude || null]
  );

  return result.insertId;
};

const getAllOfflineLogs = async () => {
  const [rows] = await db.execute(
    `SELECT offlineLog_id, sender_no, message_cont, receive_at, latitude, longitude
     FROM offline_log
     ORDER BY offlineLog_id DESC`
  );

  return rows;
};

module.exports = {
  createOfflineLog,
  getAllOfflineLogs,
};
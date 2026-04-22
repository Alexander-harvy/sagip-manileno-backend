require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const healthRoutes = require("../routes/healthRoutes");
const userRoutes = require("../routes/userRoutes");
const responderRoutes = require("../routes/responderRoutes");
const incidentRoutes = require("../routes/incidentRoutes");
const adminRoutes = require("../routes/adminRoutes");
const departmentRoutes = require("../routes/departmentRoutes");
const offlineLogRoutes = require("../routes/offlinelogRoutes");
//const adminRoutes = require("../routes/adminRoutes");
const substationRoutes = require("../routes/substationRoutes");



app.use(express.json());

//app.use("/api/admin", adminRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/responders", responderRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/substations", substationRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/offline-logs", offlineLogRoutes);

app.get("/", (req, res) => {
  res.send("Sagip Manileno API is running");
});

module.exports = app;



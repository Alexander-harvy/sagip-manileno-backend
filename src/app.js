require("dotenv").config();

const express = require("express");
const app = express();

const healthRoutes = require("../routes/healthRoutes");
const userRoutes = require("../routes/userRoutes");
const responderRoutes = require("../routes/responderRoutes");
const incidentRoutes = require("../routes/incidentRoutes");

app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/responders", responderRoutes);
app.use("/api/incidents", incidentRoutes);


app.get("/", (req, res) => {
  res.send("Sagip Manileno API is running");
});

module.exports = app;



const express = require("express");
const cors = require("cors");
const uploadRoutes = require("./routes/uploadRoutes");
const exportRoutes = require("./routes/exportRoutes");
const dataRoutes = require("./routes/dataRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
require("dotenv").config();

const app = express();

// CORS configuration
app.use(cors());

// Increase payload size limit
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Static directory for frontend
app.use(express.static("public"));

// Routes
app.use("/api/upload", uploadRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/categories", categoryRoutes);

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

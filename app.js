const express = require("express");
const app = express();
const uploadRoutes = require("./routes/uploadRoutes");
const exportRoutes = require("./routes/exportRoutes");
const dataRoutes = require("./routes/dataRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cors = require("cors");
require("dotenv").config();

app.use(
  cors({
    origin: "http://localhost:3001", // Replace with your frontend's URL
    methods: ["POST", "GET"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

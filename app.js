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
    origin: (origin, callback) => {
      if (!origin || process.env.NODE_ENV === "development") {
        return callback(null, true);
      }
      const allowedOrigins = [
        "http://localhost:*",
        "https://cloud-left-task-3g4mqcjub-hassanmostfas-projects.vercel.app",
        "https://cloud-left-task.vercel.app",
      ];
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
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

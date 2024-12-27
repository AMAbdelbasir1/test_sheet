const express = require("express");
const { exportDataToSpreadsheet } = require("../controllers/exportController");
const router = express.Router();

// GET /api/export
router.get("/", exportDataToSpreadsheet);

module.exports = router;

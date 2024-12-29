const express = require("express");
const multer = require("multer");
const { uploadSpreadsheet } = require("../controllers/uploadController");
const router = express.Router();

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB limit
});

router.post("/", upload.single("file"), uploadSpreadsheet);

module.exports = router;

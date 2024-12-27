const express = require("express");
const multer = require("multer");
const { uploadSpreadsheet } = require("../controllers/uploadController");
const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), uploadSpreadsheet);

module.exports = router;

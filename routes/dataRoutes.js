const express = require("express");
const {
  getFoodData,
  getNonFoodData,
  addItems,
} = require("../controllers/dataController");
const router = express.Router();

// Food data endpoint
router.get("/food", getFoodData);

// Non-Food data endpoint
router.get("/non-food", getNonFoodData);

router.post("/add-items", addItems);
module.exports = router;

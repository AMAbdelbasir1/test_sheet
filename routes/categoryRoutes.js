const categoriesController = require("../controllers/categoryController");
const express = require("express");
const router = express.Router();

router.get("/maincategories/:type", categoriesController.getMainCategories);
router.get(
  "/subcategories/:mainCategoryId",
  categoriesController.getSubCategoriesByMainCategory,
);
router.get(
  "/subsubcategories/:subCategoryId",
  categoriesController.getSubSubCategoriesBySubCategory,
);

module.exports = router;

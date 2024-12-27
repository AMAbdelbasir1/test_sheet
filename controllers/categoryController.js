const {
  getMainCategoriesByType,
  getSubcategoriesByMainCategory,
 getSubSubcategoriesBySubcategory,
} = require("../models/categoryQueries");

// Get main categories
// @ route GET /api/categories/maincategories/:type
exports.getMainCategories = async (req, res) => {
  try {
    const { type } = req.params;
    const mainCategories = await getMainCategoriesByType(type);
    res.status(200).json({
      message: "Main categories fetched successfully",
      status: "success",
      data: mainCategories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching main categories",
      status: "error",
      data: null,
    });
  }
};

// Get sub categories
// @ route GET /api/categories/subcategories/:mainCategoryId
exports.getSubCategoriesByMainCategory = async (req, res) => {
  try {
    const { mainCategoryId } = req.params;
    const subCategories = await getSubcategoriesByMainCategory(mainCategoryId);
    res.status(200).json({
      message: "Sub categories fetched successfully",
      status: "success",
      data: subCategories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching sub categories",
      status: "error",
      data: null,
    });
  }
};

// Get sub sub categories
// @ route GET /api/categories/subsubcategories/:subCategoryId
exports.getSubSubCategoriesBySubCategory = async (req, res) => {
  try {
    const { subCategoryId } = req.params;
    const subSubCategories = await getSubSubcategoriesBySubcategory(
      subCategoryId,
    );
    res.status(200).json({
      message: "Sub sub categories fetched successfully",
      status: "success",
      data: subSubCategories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching sub sub categories",
      status: "error",
      data: null,
    });
  }
};

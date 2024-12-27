const {
  getAllFoodData,
  getAllNonFoodData,
} = require("../models/exportQueries");
const {
  getOrCreateMainCategory,
  getOrCreateSubCategory,
  getOrCreateSubSubCategory,
} = require("../models/categoryQueries");
const { insertFoodItem } = require("../models/foodQueries");
const { insertNonFoodItem } = require("../models/nonFoodQueries");
// Endpoint for fetching food data
exports.getFoodData = async (req, res) => {
  try {
    const data = await getAllFoodData();
    res.status(200).json({
      message: "Data fetched successfully",
      status: "success",
      data: removeBaseCodeAndSuffix(data),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching food data." });
  }
};

// Endpoint for fetching non-food data
exports.getNonFoodData = async (req, res) => {
  try {
    const data = await getAllNonFoodData();
    res.status(200).json({
      message: "Data fetched successfully",
      status: "success",
      data: removeBaseCodeAndSuffix(data),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching non-food data." });
  }
};

// add items
// @ route POST /api/data

exports.addItems = async (req, res) => {
  try {
    const data = req.body.item;
    const subSubCategory = await checkFoundCategoriesAndInsert(data);
    if (data.item_type === "Food") {
      await insertFoodItem(data, subSubCategory);
      console.log("end");
    } else {
      await insertNonFoodItem(data, subSubCategory);
    }
    res.status(200).json({ message: "Items added successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching non-food data." });
  }
};

const checkFoundCategoriesAndInsert = async (data) => {
  const {
    en_categorie1,
    en_categorie2,
    en_categorie3,
    ar_categorie1,
    ar_categorie2,
    ar_categorie3,
    item_type,
  } = data;

  const mainCategory = await getOrCreateMainCategory(
    en_categorie1,
    ar_categorie1,
    item_type,
  );
  const subCategory = await getOrCreateSubCategory(
    mainCategory,
    en_categorie2,
    ar_categorie2,
  );
  const subSubCategory = await getOrCreateSubSubCategory(
    subCategory,
    en_categorie3,
    ar_categorie3,
  );
  return subSubCategory;
};

const removeBaseCodeAndSuffix = (data) => {
  return data.map((item) => {
    const { BaseBarcode, Barcode_Suffix, ...rest } = item;
    return rest;
  });
};

const path = require("path");
const xlsx = require("xlsx");
const fs = require("fs");
const {
  getOrCreateMainCategory,
  getOrCreateSubCategory,
  getOrCreateSubSubCategory,
} = require("../models/categoryQueries");
const { insertOrUpdateFoodItem } = require("../models/foodQueries");
const { insertOrUpdateNonFoodItem } = require("../models/nonFoodQueries");

exports.uploadSpreadsheet = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No file uploaded", status: "error", data: null });
    }
    // Parse the uploaded file
    const filePath = path.join(__dirname, "../uploads", req.file.filename);
    const workbook = xlsx.readFile(filePath);
    const sheets = workbook.SheetNames;

    for (const sheet of sheets) {
      const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet], {
        defval: null,
      });

      // Determine type based on sheet name
      const isFoodSheet = sheet.toLowerCase() === "food" ? true : false;
      const type = isFoodSheet ? "Food" : "Non Food";

      for (const row of data) {
        // Create or find the hierarchical categories
        const mainCategoryId = await getOrCreateMainCategory(
          row["En Categorie 1"],
          row["Ar Categorie 1"],
          type,
        );
        const subCategoryId = await getOrCreateSubCategory(
          mainCategoryId,
          row["En Categorie 2"],
          row["Ar Categorie2"],
        );
        const subSubCategoryId = await getOrCreateSubSubCategory(
          subCategoryId,
          row["En Categorie 3"],
          row["Ar Categorie3"],
        );

        // Insert or update item based on the sheet name
        if (isFoodSheet) {
          await insertOrUpdateFoodItem(row, subSubCategoryId);
        } else {
          await insertOrUpdateNonFoodItem(row, subSubCategoryId);
        }
      }
    }

    res.status(200).json({
      message: "Spreadsheet processed successfully",
      status: "success",
      data: null,
    });
    console.log("Spreadsheet processed successfully");
    deleteFile(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error processing spreadsheet",
      status: "error",
      data: null,
    });
    if (req.file) {
      deleteFile(req.file.path);
    }
  }
};

const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      }
    });
  }
};

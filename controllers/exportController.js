const xlsx = require("xlsx");
const {
  getAllFoodData,
  getAllNonFoodData,
} = require("../models/exportQueries");
const path = require("path");
const fs = require("fs");
exports.exportDataToSpreadsheet = async (req, res) => {
  try {
    // Fetch data
    const foodData = await getAllFoodData({});
    const nonFoodData = await getAllNonFoodData({});

    // Create a new workbook
    const workbook = xlsx.utils.book_new();

    // Add Food Data to Sheet
    const foodSheet = xlsx.utils.json_to_sheet(
      removeBaseCodeAndSuffix(foodData),
    );
    xlsx.utils.book_append_sheet(workbook, foodSheet, "Food");

    // Add Non-Food Data to Sheet
    const nonFoodSheet = xlsx.utils.json_to_sheet(
      removeBaseCodeAndSuffix(nonFoodData),
    );
    xlsx.utils.book_append_sheet(workbook, nonFoodSheet, "Non Food");

    // Define file path and name
    const filePath = path.join(__dirname, "../exports", "ExportedData.xlsx");

    // Write workbook to file
    xlsx.writeFile(workbook, filePath);

    // Send file for download
    res.download(filePath, "ExportedData.xlsx", (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).send("Error exporting data");
      }
      deleteFile(filePath);
    });
  } catch (error) {
    console.error("Error exporting data:", error);
    res.status(500).json({ error: "Error exporting data" });
  }
};

const removeBaseCodeAndSuffix = (data) => {
  return data.map((item) => {
    const { BaseBarcode, Barcode_Suffix, NameEn, NameAr, ...rest } = item;
    return rest;
  });
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

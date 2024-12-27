const pool = require("./database");

exports.insertOrUpdateFoodItem = async (row, subSubCategoryId) => {
  const baseBarcode = row["Barcode"]
    ? String(row["Barcode"]).split("-")[0]
    : null;
  if (!baseBarcode) return;

  const barcodeSuffix =
    row["Barcode"] && String(row["Barcode"]).includes("-")
      ? parseInt(row["Barcode"].split("-")[1], 10)
      : 0;

  const [existing] = await pool.query(
    `SELECT id FROM food_items WHERE barcode = ? AND barcode_suffix = ?`,
    [baseBarcode, barcodeSuffix],
  );
  if (existing.length > 0) {
    // Update existing food item
    await pool.query(
      `
            UPDATE food_items SET
                sub_subcategory_id = ?, sku_erp = ?, sku_web = ?, name_en = ?, name_ar = ?,
                pc_price = ?, pack_price = ?, brand = ?, en_keywords = ?, 
                ar_keywords = ?, country_of_manufacture = ?, product_type = ?, 
                pcs = ?, pack_size = ?, flavours_en = ?, flavours_ar = ?, 
                color_en = ?, color_ar = ?, umf_degree = ?, weight = ?
            WHERE id = ?
        `,
      [
        subSubCategoryId,
        row["sku-ERP"] || null,
        row["sku-WEB"] || null,
        row["Name-En"] || null,
        row["Name-Ar"] || null,
        row["Pc Price"] || null,
        row["Pack Price"] || null,
        row["Brand"] || null,
        row["En_keywords"] || null,
        row["Ar_keywords"] || null,
        row["country_of_manufacture"] || null,
        row["product_type"] || null,
        row["Pcs"] || null,
        row["Pack size"] || null,
        row["Flavours-En"] || null,
        row["Flavours-Ar"] || null,
        row["Color-En"] || null,
        row["Color-Ar"] || null,
        row["UMF Degree"] || null,
        row["Weight"] || null,
        existing[0].id,
      ],
    );
  } else {
    // Insert new food item
    await pool.query(
      `
            INSERT INTO food_items (
                sub_subcategory_id, barcode, barcode_suffix, sku_erp, sku_web, name_en, name_ar,
                pc_price, pack_price, brand, en_keywords, ar_keywords, 
                country_of_manufacture, product_type, pcs, pack_size, 
                flavours_en, flavours_ar, color_en, color_ar, umf_degree, weight
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
      [
        subSubCategoryId,
        baseBarcode,
        barcodeSuffix,
        row["sku-ERP"] || null,
        row["sku-WEB"] || null,
        row["Name-En"] || null,
        row["Name-Ar"] || null,
        row["Pc Price"] || null,
        row["Pack Price"] || null,
        row["Brand"] || null,
        row["En_keywords"] || null,
        row["Ar_keywords"] || null,
        row["country_of_manufacture"] || null,
        row["product_type"] || null,
        row["Pcs"] || null,
        row["Pack size"] || null,
        row["Flavours-En"] || null,
        row["Flavours-Ar"] || null,
        row["Color-En"] || null,
        row["Color-Ar"] || null,
        row["UMF Degree"] || null,
        row["Weight"] || null,
      ],
    );
  }
};

exports.insertFoodItem = async (row, subSubCategoryId) => {
  const baseBarcode = row.barcode ? String(row.barcode) : null;
  if (!baseBarcode) return;

  const existingBarcode = await checkFoundBarcodeAndMaxbarcodeSuffix(
    baseBarcode,
  );
  if (existingBarcode.found && existingBarcode.maxBarcodeSuffix == 0) {
    await updateMakeBarcodeSuffixEquailOne(existingBarcode.id);
    existingBarcode.maxBarcodeSuffix = 1;
  }
  const barcodeSuffix = existingBarcode.found
    ? existingBarcode.maxBarcodeSuffix + 1
    : 0;
  await pool.query(
    `
            INSERT INTO food_items (
                sub_subcategory_id, barcode, barcode_suffix, sku_erp, sku_web, name_en, name_ar,
                pc_price, pack_price, brand, en_keywords, ar_keywords, 
                country_of_manufacture, product_type, pcs, pack_size, 
                flavours_en, flavours_ar, color_en, color_ar, umf_degree, weight
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
    [
      subSubCategoryId,
      baseBarcode,
      barcodeSuffix,
      row?.sku_ERP || null,
      row?.sku_WEB || null,
      row?.name_en || null,
      row?.name_ar || null,
      row?.pc_price || null,
      row?.Pack_Price || null,
      row?.brand || null,
      row?.en_keywords || null,
      row?.ar_keywords || null,
      row?.country_of_manufacture || null,
      row?.product_type || null,
      row?.pcs || null,
      row?.pack_size || null,
      row?.flavours_en || null,
      row?.flavours_ar || null,
      row?.color_en || null,
      row?.color_ar || null,
      row?.umf_degree || null,
      row?.weight || null,
    ],
  );
};

const checkFoundBarcodeAndMaxbarcodeSuffix = async (barcode) => {
  const [result] = await pool.query(
    `SELECT * FROM food_items WHERE barcode = ? ORDER BY barcode_suffix DESC LIMIT 1`,
    [barcode],
  );

  if (result.length > 0) {
    return {
      found: true,
      maxBarcodeSuffix: result[0].barcode_suffix,
      id: result[0].id,
    };
  } else {
    return {
      found: false,
      maxBarcodeSuffix: 0,
    };
  }
};

const updateMakeBarcodeSuffixEquailOne = async (item_id) => {
  await pool.query(`UPDATE food_items SET barcode_suffix = 1 WHERE id = ?`, [
    item_id,
  ]);
  return;
};

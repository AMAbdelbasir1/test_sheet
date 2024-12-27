const pool = require("./database");

exports.insertOrUpdateNonFoodItem = async (row, subSubCategoryId) => {
  const baseBarcode = row["Barcode"]
    ? String(row["Barcode"]).split("-")[0]
    : null;
  if (!baseBarcode) return;

  const barcodeSuffix =
    row["Barcode"] && String(row["Barcode"]).includes("-")
      ? parseInt(row["Barcode"].split("-")[1], 10)
      : 0;

  const [existing] = await pool.query(
    `SELECT id FROM non_food_items WHERE barcode = ? AND barcode_suffix = ?`,
    [baseBarcode, barcodeSuffix],
  );
  if (existing.length > 0) {
    await pool.query(
      `
            UPDATE non_food_items SET
                sub_subcategory_id = ?, sku_erp = ?, sku_web = ?, name_en = ?, name_ar = ?,
                pc_price = ?, pack_price = ?, vendor = ?, brand = ?, en_keywords = ?, 
                ar_keywords = ?, country_of_manufacture = ?, product_type = ?, pcs = ?, 
                capacity = ?, size = ?, color_en = ?, color_ar = ?, type = ?, 
                scent_ar = ?, scent_en = ?
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
        row["Vendor"] || null,
        row["Brand"] || null,
        row["En_keywords"] || null,
        row["Ar_keywords"] || null,
        row["country_of_manufacture"] || null,
        row["product_type"] || null,
        row["Pcs"] || null,
        row["Capacity"] || null,
        row["Size"] || null,
        row["Color-En"] || null,
        row["Color-Ar"] || null,
        row["Type"] || null,
        row["Scent-Ar"] || null,
        row["Scent-En"] || null,
        existing[0].id,
      ],
    );
  } else {
    await pool.query(
      `
            INSERT INTO non_food_items (
                sub_subcategory_id, barcode, barcode_suffix, sku_erp, sku_web, name_en, name_ar,
                pc_price, pack_price, vendor, brand, en_keywords, ar_keywords, 
                country_of_manufacture, product_type, pcs, capacity, size, 
                color_en, color_ar, type, scent_ar, scent_en
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        row["Vendor"] || null,
        row["Brand"] || null,
        row["En_keywords"] || null,
        row["Ar_keywords"] || null,
        row["country_of_manufacture"] || null,
        row["product_type"] || null,
        row["Pcs"] || null,
        row["Capacity"] || null,
        row["Size"] || null,
        row["Color-En"] || null,
        row["Color-Ar"] || null,
        row["Type"] || null,
        row["Scent-Ar"] || null,
        row["Scent-En"] || null,
      ],
    );
  }
};

exports.insertNonFoodItem = async (row, subSubCategoryId) => {
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
            INSERT INTO non_food_items (
                sub_subcategory_id, barcode, barcode_suffix, sku_erp, sku_web, name_en, name_ar,
                pc_price, pack_price, vendor, brand, en_keywords, ar_keywords, 
                country_of_manufacture, product_type, pcs, capacity, size, 
                color_en, color_ar, type, scent_ar, scent_en
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      row?.vendor || null,
      row?.brand || null,
      row?.en_keywords || null,
      row?.ar_keywords || null,
      row?.country_of_manufacture || null,
      row?.product_type || null,
      row?.pcs || null,
      row?.capacity || null,
      row?.size || null,
      row?.color_en || null,
      row?.color_ar || null,
      row?.type || null,
      row?.scent_ar || null,
      row?.scent_en || null,
    ],
  );
};
const checkFoundBarcodeAndMaxbarcodeSuffix = async (baseBarcode) => {
  const [result] = await pool.query(
    `SELECT id, barcode_suffix FROM non_food_items WHERE barcode = ? ORDER BY barcode_suffix DESC LIMIT 1`,
    [baseBarcode],
  );
  return {
    found: result.length > 0,
    maxBarcodeSuffix: result[0].barcode_suffix,
    id: result[0].id,
  };
};

const updateMakeBarcodeSuffixEquailOne = async (item_id) => {
  await pool.query(
    `UPDATE non_food_items SET barcode_suffix = 1 WHERE id = ?`,
    [item_id],
  );
  return;
};

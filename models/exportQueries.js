const pool = require("./database");

exports.getAllFoodData = async (filters) => {
  const { brand, name, barcode } = filters;

  // Dynamic WHERE clause and parameters
  let whereClause = "1=1"; // Default condition
  const params = [];

  if (brand) {
    whereClause += " AND LOWER(Brand) LIKE LOWER(?)";
    params.push(`%${brand}%`);
  }
  if (name) {
    whereClause +=
      " AND ( LOWER(NameEn) LIKE LOWER(?) OR LOWER(NameAr) LIKE LOWER(?))";
    params.push(`%${name}%`, `%${name}%`);
  }
  if (barcode) {
    whereClause += " AND BaseBarcode = ?";
    params.push(barcode);
  }

  const query = `
    WITH CombinedData AS (
      -- First query: Join with subcategories
      SELECT 
        FI.sku_erp AS "sku-ERP",
        CONCAT(FI.barcode, IF(FI.barcode_suffix > 0, CONCAT('-', FI.barcode_suffix), '')) AS Barcode,
        FI.barcode_suffix AS "Barcode_Suffix",
        FI.barcode AS "BaseBarcode",
        FI.sku_web AS "sku-WEB",
        MC.name_en AS "En Categorie 1",
        SC.name_en AS "En Categorie 2",
        NULL AS "En Categorie 3",
        MC.name_ar AS "Ar Categorie 1",
        SC.name_ar AS "Ar Categorie2",
        NULL AS "Ar Categorie3",
        FI.name_en AS "Name-En",
        FI.name_ar AS "Name-Ar",
        FI.name_en AS "NameEn",
        FI.name_ar AS "NameAr",
        FI.pc_price AS "Pc Price",
        FI.pack_price AS "Pack Price",
        FI.brand AS Brand,
        FI.en_keywords AS "En_keywords",
        FI.ar_keywords AS "Ar_keywords",
        FI.country_of_manufacture AS "country_of_manufacture",
        FI.product_type AS "product_type",
        FI.pcs AS "Pcs",
        FI.pack_size AS "Pack size",
        FI.flavours_en AS "Flavours-En",
        FI.flavours_ar AS "Flavours-Ar",
        FI.color_en AS "Color-En",
        FI.color_ar AS "Color-Ar",
        FI.umf_degree AS "UMF Degree",
        FI.weight AS "Weight"
      FROM 
        food_items FI
      JOIN subcategories SC ON FI.sub_subcategory_id = SC.id
      JOIN main_categories MC ON SC.main_category_id = MC.id AND MC.type = 'Food'

      UNION ALL

      -- Second query: Join with sub_subcategories
      SELECT 
        FI.sku_erp AS "sku-ERP",
        CONCAT(FI.barcode, IF(FI.barcode_suffix > 0, CONCAT('-', FI.barcode_suffix), '')) AS Barcode,
        FI.barcode_suffix AS "Barcode_Suffix",
        FI.barcode AS "BaseBarcode",
        FI.sku_web AS "sku-WEB",
        MC.name_en AS "En Categorie 1",
        SC.name_en AS "En Categorie 2",
        SSC.name_en AS "En Categorie 3",
        MC.name_ar AS "Ar Categorie 1",
        SC.name_ar AS "Ar Categorie2",
        SSC.name_ar AS "Ar Categorie3",
        FI.name_en AS "Name-En",
        FI.name_ar AS "Name-Ar",
        FI.name_en AS "NameEn",
        FI.name_ar AS "NameAr",
        FI.pc_price AS "Pc Price",
        FI.pack_price AS "Pack Price",
        FI.brand AS Brand,
        FI.en_keywords AS "En_keywords",
        FI.ar_keywords AS "Ar_keywords",
        FI.country_of_manufacture AS "country_of_manufacture",
        FI.product_type AS "product_type",
        FI.pcs AS "Pcs",
        FI.pack_size AS "Pack size",
        FI.flavours_en AS "Flavours-En",
        FI.flavours_ar AS "Flavours-Ar",
        FI.color_en AS "Color-En",
        FI.color_ar AS "Color-Ar",
        FI.umf_degree AS "UMF Degree",
        FI.weight AS "Weight"
      FROM 
        food_items FI
      JOIN sub_subcategories SSC ON FI.sub_subcategory_id = SSC.id
      JOIN subcategories SC ON SSC.subcategory_id = SC.id
      JOIN main_categories MC ON SC.main_category_id = MC.id AND MC.type = 'Food'

      UNION ALL

      -- Third query: Direct join with main_categories
      SELECT 
        FI.sku_erp AS "sku-ERP",
        CONCAT(FI.barcode, IF(FI.barcode_suffix > 0, CONCAT('-', FI.barcode_suffix), '')) AS Barcode,
        FI.barcode_suffix AS "Barcode_Suffix",
        FI.barcode AS "BaseBarcode",
        FI.sku_web AS "sku-WEB",
        MC.name_en AS "En Categorie 1",
        NULL AS "En Categorie 2",
        NULL AS "En Categorie 3",
        MC.name_ar AS "Ar Categorie 1",
        NULL AS "Ar Categorie2",
        NULL AS "Ar Categorie3",
        FI.name_en AS "Name-En",
        FI.name_ar AS "Name-Ar",
        FI.name_en AS "NameEn",
        FI.name_ar AS "NameAr",
        FI.pc_price AS "Pc Price",
        FI.pack_price AS "Pack Price",
        FI.brand AS Brand,
        FI.en_keywords AS "En_keywords",
        FI.ar_keywords AS "Ar_keywords",
        FI.country_of_manufacture AS "country_of_manufacture",
        FI.product_type AS "product_type",
        FI.pcs AS "Pcs",
        FI.pack_size AS "Pack size",
        FI.flavours_en AS "Flavours-En",
        FI.flavours_ar AS "Flavours-Ar",
        FI.color_en AS "Color-En",
        FI.color_ar AS "Color-Ar",
        FI.umf_degree AS "UMF Degree",
        FI.weight AS "Weight"
      FROM 
        food_items FI
      JOIN main_categories MC ON FI.sub_subcategory_id = MC.id AND MC.type = 'Food'
    )
    SELECT *
    FROM CombinedData
    WHERE ${whereClause}
    ORDER BY BaseBarcode, Barcode_Suffix, "En Categorie 1", "En Categorie 2", "En Categorie 3";
  `;
  const [rows] = await pool.query(query, params);
  return rows;
};

exports.getAllNonFoodData = async (filters) => {
  const { brand, name, barcode } = filters;

  // Dynamic WHERE clause for filters
  let whereClause = "WHERE 1=1"; // Default condition to allow dynamic appending
  const params = [];

  if (brand) {
    whereClause += " AND LOWER(Brand) LIKE LOWER(?)";
    params.push(`%${brand}%`);
  }
  if (name) {
    whereClause +=
      " AND (LOWER(NameEn) LIKE LOWER(?) OR LOWER(NameAr) LIKE LOWER(?))";
    params.push(`%${name}%`, `%${name}%`);
  }
  if (barcode) {
    whereClause += " AND BaseBarcode = ?";
    params.push(barcode);
  }

  // Base query with UNION ALL
  const query = `
    WITH CombinedData AS (
      -- First query: Join with subcategories
    SELECT 
      NFI.sku_erp AS "sku-ERP",
      CONCAT(NFI.barcode, IF(NFI.barcode_suffix > 0, CONCAT('-', NFI.barcode_suffix), '')) AS Barcode,
      NFI.barcode_suffix AS "Barcode_Suffix",
      NFI.barcode AS "BaseBarcode",
      NFI.sku_web AS "sku-WEB",
      MC.name_en AS "En Categorie 1",
      SC.name_en AS "En Categorie 2",
      NULL AS "En Categorie 3",
      MC.name_ar AS "Ar Categorie 1",
      SC.name_ar AS "Ar Categorie2",
      NULL AS "Ar Categorie3",
      NFI.name_en AS "Name-En",
      NFI.name_ar AS "Name-Ar",
      NFI.name_en AS "NameEn",
      NFI.name_ar AS "NameAr",
      NFI.pc_price AS "Pc Price",
      NFI.pack_price AS "Pack Price",
      NFI.vendor AS Vendor,
      NFI.brand AS Brand,
      NFI.en_keywords AS "En_keywords",
      NFI.ar_keywords AS "Ar_keywords",
      NFI.country_of_manufacture AS "country_of_manufacture",
      NFI.product_type AS "product_type",
      NFI.pcs AS "Pcs",
      NFI.capacity AS "Capacity",
      NFI.size AS "Size",
      NFI.color_en AS "Color-En",
      NFI.color_ar AS "Color-Ar",
      NFI.type AS "Type",
      NFI.scent_ar AS "Scent-Ar",
      NFI.scent_en AS "Scent-En"
    FROM 
      non_food_items NFI
    JOIN subcategories SC ON NFI.sub_subcategory_id = SC.id
    JOIN main_categories MC ON SC.main_category_id = MC.id AND MC.type = 'Non Food'

    UNION ALL

    -- Second query: Join with sub_subcategories
    SELECT 
      NFI.sku_erp AS "sku-ERP",
      CONCAT(NFI.barcode, IF(NFI.barcode_suffix > 0, CONCAT('-', NFI.barcode_suffix), '')) AS Barcode,
      NFI.barcode_suffix AS "Barcode_Suffix",
      NFI.barcode AS "BaseBarcode",
      NFI.sku_web AS "sku-WEB",
      MC.name_en AS "En Categorie 1",
      SC.name_en AS "En Categorie 2",
      SSC.name_en AS "En Categorie 3",
      MC.name_ar AS "Ar Categorie 1",
      SC.name_ar AS "Ar Categorie2",
      SSC.name_ar AS "Ar Categorie3",
      NFI.name_en AS "Name-En",
      NFI.name_ar AS "Name-Ar",
      NFI.name_en AS "NameEn",
      NFI.name_ar AS "NameAr",
      NFI.pc_price AS "Pc Price",
      NFI.pack_price AS "Pack Price",
      NFI.vendor AS Vendor,
      NFI.brand AS Brand,
      NFI.en_keywords AS "En_keywords",
      NFI.ar_keywords AS "Ar_keywords",
      NFI.country_of_manufacture AS "country_of_manufacture",
      NFI.product_type AS "product_type",
      NFI.pcs AS "Pcs",
      NFI.capacity AS "Capacity",
      NFI.size AS "Size",
      NFI.color_en AS "Color-En",
      NFI.color_ar AS "Color-Ar",
      NFI.type AS "Type",
      NFI.scent_ar AS "Scent-Ar",
      NFI.scent_en AS "Scent-En"
    FROM 
      non_food_items NFI
    JOIN sub_subcategories SSC ON NFI.sub_subcategory_id = SSC.id
    JOIN subcategories SC ON SSC.subcategory_id = SC.id
    JOIN main_categories MC ON SC.main_category_id = MC.id AND MC.type = 'Non Food'

    UNION ALL

    -- Third query: Direct join with main_categories
    SELECT 
      NFI.sku_erp AS "sku-ERP",
      CONCAT(NFI.barcode, IF(NFI.barcode_suffix > 0, CONCAT('-', NFI.barcode_suffix), '')) AS Barcode,
      NFI.barcode_suffix AS "Barcode_Suffix",
      NFI.barcode AS "BaseBarcode",
      NFI.sku_web AS "sku-WEB",
      MC.name_en AS "En Categorie 1",
      NULL AS "En Categorie 2",
      NULL AS "En Categorie 3",
      MC.name_ar AS "Ar Categorie 1",
      NULL AS "Ar Categorie2",
      NULL AS "Ar Categorie3",
      NFI.name_en AS "Name-En",
      NFI.name_ar AS "Name-Ar",
      NFI.name_en AS "NameEn",
      NFI.name_ar AS "NameAr",
      NFI.pc_price AS "Pc Price",
      NFI.pack_price AS "Pack Price",
      NFI.vendor AS Vendor,
      NFI.brand AS Brand,
      NFI.en_keywords AS "En_keywords",
      NFI.ar_keywords AS "Ar_keywords",
      NFI.country_of_manufacture AS "country_of_manufacture",
      NFI.product_type AS "product_type",
      NFI.pcs AS "Pcs",
      NFI.capacity AS "Capacity",
      NFI.size AS "Size",
      NFI.color_en AS "Color-En",
      NFI.color_ar AS "Color-Ar",
      NFI.type AS "Type",
      NFI.scent_ar AS "Scent-Ar",
      NFI.scent_en AS "Scent-En"
    FROM 
      non_food_items NFI
    JOIN main_categories MC ON NFI.sub_subcategory_id = MC.id AND MC.type = 'Non Food'
)
 SELECT *
    FROM CombinedData
    ${whereClause}
    ORDER BY BaseBarcode, Barcode_Suffix, "En Categorie 1", "En Categorie 2", "En Categorie 3";
  `;

  const [rows] = await pool.query(query, params);
  return rows;
};

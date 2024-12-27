const pool = require("./database");
const { v4: uuid } = require("uuid");
exports.getOrCreateMainCategory = async (nameEn, nameAr, type) => {
  if (!nameEn) return null;

  const [rows] = await pool.query(
    `SELECT id FROM main_categories WHERE name_en = ? AND type = ?`,
    [nameEn, type],
  );
  if (rows.length > 0) {
    return rows[0].id; // Return existing category ID
  }
  const id = uuid();
  const [result] = await pool.query(
    `INSERT INTO main_categories (id, name_en, name_ar, type) VALUES (?, ?, ?, ?)`,
    [id, nameEn, nameAr, type],
  );
  return id; // Return newly created category ID
};

exports.getOrCreateSubCategory = async (mainCategoryId, nameEn, nameAr) => {
  if (!nameEn) return mainCategoryId;
  const [rows] = await pool.query(
    `SELECT id FROM subcategories WHERE main_category_id = ? AND name_en = ?`,
    [mainCategoryId, nameEn],
  );
  if (rows.length > 0) return rows[0].id;
  const id = uuid();
  const [result] = await pool.query(
    `INSERT INTO subcategories (id, main_category_id, name_en, name_ar) VALUES ( ?, ?, ?, ?)`,
    [id, mainCategoryId, nameEn, nameAr],
  );
  return id;
};

exports.getOrCreateSubSubCategory = async (subCategoryId, nameEn, nameAr) => {
  if (!nameEn) return subCategoryId;
  const [rows] = await pool.query(
    `SELECT id FROM sub_subcategories WHERE subcategory_id = ? AND name_en = ?`,
    [subCategoryId, nameEn],
  );
  if (rows.length > 0) return rows[0].id;
  const id = uuid();
  const [result] = await pool.query(
    `INSERT INTO sub_subcategories ( id, subcategory_id, name_en, name_ar) VALUES ( ?, ?, ?, ?)`,
    [id, subCategoryId, nameEn, nameAr],
  );
  return id;
};

exports.getMainCategoriesByType = async (type) => {
  const [rows] = await pool.query(
    `SELECT * FROM main_categories WHERE type = ?`,
    [type],
  );
  return rows;
};

exports.getSubcategoriesByMainCategory = async (mainCategoryId) => {
  const [rows] = await pool.query(
    `SELECT * FROM subcategories WHERE main_category_id = ?`,
    [mainCategoryId],
  );
  return rows;
};

exports.getSubSubcategoriesBySubcategory = async (subcategoryId) => {
  const [rows] = await pool.query(
    `SELECT * FROM sub_subcategories WHERE subcategory_id = ?`,
    [subcategoryId],
  );
  return rows;
};

const { check } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");
exports.addItemValidators = [
  check("item.item_type")
    .notEmpty()
    .withMessage("item_type is required")
    .isIn(["Food", "Non Food", "Non-Food"]),
  check("item.sku_ERP").notEmpty().withMessage("sku_ERP is required"),
  check("item.barcode").notEmpty().withMessage("barcode is required"),
  check("item.en_categorie1")
    .notEmpty()
    .withMessage("Main Category English name is required"),
  check("item.ar_categorie1")
    .notEmpty()
    .withMessage("Main Category Arabic name is required"),
  check("item.name_en").notEmpty().withMessage("Name English is required"),
  check("item.name_ar").notEmpty().withMessage("Name Arabic is required"),
  validatorMiddleware,
];

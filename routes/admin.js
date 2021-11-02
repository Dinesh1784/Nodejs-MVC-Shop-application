const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const { body } = require("express-validator/check");

router.get("/add-product", isAuth, adminController.getAddProduct);
router.post(
  "/add-product",
  [
    body("title", "title cannot be empty")
      .isString()
      .isLength({ min: 3 })
      .trim(),
    // body("imageUrl", "image URL cannot be empty").isURL(),
    body("price", "price cannot be empty").isFloat(),
    body("description", "description cannot be empty")
      .isLength({ min: 5, max: 200 })
      .trim(),
  ],
  isAuth,
  adminController.postAddProduct
);
router.get("/products", isAuth, adminController.getProducts);
router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);
router.post(
  "/edit-product",
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("price").isFloat(),
    body("description").isLength({ min: 5, max: 200 }).trim(),
  ],
  isAuth,
  adminController.postEditProduct
);
router.post("/delete-product", isAuth, adminController.postDeleteProduct);
module.exports = router;

// body("imageUrl").isURL(),

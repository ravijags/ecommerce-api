const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    getAllProducts,
    getOneProduct,
    createProduct,
    updateProduct,
    deleteProduct,
} = require("../controllers/productController");


router.get("/",getAllProducts);

router.get("/:id", getOneProduct);

router.post("/", protect, createProduct);

router.put("/:id", protect, updateProduct);

router.delete("/:id", protect, deleteProduct);

module.exports = router;
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  placeOrder,
  getMyOrders,
  getOneOrder,
  updateOrderStatus,
} = require("../controllers/orderController");

router.post("/", protect, placeOrder);

router.get("/", protect, getMyOrders);

router.get("/:id", protect, getOneOrder);

router.put("/:id", protect, updateOrderStatus);

module.exports = router;
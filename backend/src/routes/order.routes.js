const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const OrderController = require("../controllers/order.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validation.middleware");

router.use(authenticate);

router.post(
  "/",
  [body("templateId").notEmpty().withMessage("Template ID is required")],
  validate,
  OrderController.create
);

router.get("/my-orders", OrderController.getMyOrders);

// Admin
router.get("/", authorize("admin"), OrderController.getAll);
router.get("/stats", authorize("admin"), OrderController.getStats);

module.exports = router;

const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/order.controller");
const UserController = require("../controllers/user.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

router.use(authenticate, authorize("admin"));

router.get("/stats", OrderController.getStats);
router.get("/orders", OrderController.getAll);
router.get("/users", UserController.getAll);

module.exports = router;

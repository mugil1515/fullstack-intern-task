const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

router.use(authenticate);

router.put("/profile", UserController.updateProfile);
router.put("/change-password", UserController.changePassword);
router.get("/my-templates", UserController.getMyTemplates);

// Admin
router.get("/", authorize("admin"), UserController.getAll);

module.exports = router;

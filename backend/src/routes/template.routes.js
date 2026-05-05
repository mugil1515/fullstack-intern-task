const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const TemplateController = require("../controllers/template.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validation.middleware");

// Public
router.get("/", TemplateController.getAll);
router.get("/:slug", TemplateController.getBySlug);

// Admin only
router.post(
  "/",
  authenticate,
  authorize("admin"),
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  ],
  validate,
  TemplateController.create
);

router.put("/:id", authenticate, authorize("admin"), TemplateController.update);
router.delete("/:id", authenticate, authorize("admin"), TemplateController.delete);

module.exports = router;

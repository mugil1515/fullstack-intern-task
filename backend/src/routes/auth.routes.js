const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validation.middleware");

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  validate,
  AuthController.register
);

router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  AuthController.login
);

router.get("/profile", authenticate, AuthController.getProfile);
router.post("/logout", authenticate, AuthController.logout);

module.exports = router;

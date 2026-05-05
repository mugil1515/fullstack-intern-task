const express = require("express");
const router = express.Router();
const FavouriteController = require("../controllers/favourite.controller");
const { authenticate } = require("../middlewares/auth.middleware");

router.use(authenticate);

router.post("/toggle", FavouriteController.toggle);
router.get("/", FavouriteController.getMyFavourites);
router.get("/ids", FavouriteController.getMyFavouriteIds);

module.exports = router;

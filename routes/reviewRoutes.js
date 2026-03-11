const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { requireLogin, requireRole } = require("../middleware/authMiddleware");

// Any logged in user can fetch reviews and submit one
router.get("/reviews/:org",           requireLogin, reviewController.getReviews);
router.post("/reviews",               requireLogin, reviewController.createReview);

// Admin only!!
router.post("/reviews/edit/:id",      requireLogin, requireRole("admin"), reviewController.editReview);
router.post("/reviews/delete/:id",    requireLogin, requireRole("admin"), reviewController.deleteReview);

module.exports = router;
const Review = require("../models/Review");

// GET /reviews/:org — called by script.js to load reviews for a page
async function getReviews(req, res) {
    try {
        const reviews = await Review.find({ org: req.params.org, archived: false })
        .sort({ createdAt: -1 }) 
        .populate('user');
        res.json(reviews);
    } catch (error) {
        console.error("GET REVIEWS ERROR:", error);
        res.status(500).json({ success: false });
    }
}

// POST /reviews — logged in user submits a new review
async function createReview(req, res) {
    try {
        const { org, rating, comment } = req.body;

        const newReview = new Review({
            user: req.session.user.id,
            org,
            rating,
            comment
        });

        await newReview.save();
        res.json({ success: true });

    } catch (error) {
        console.error("CREATE REVIEW ERROR:", error);
        res.status(500).json({ success: false });
    }
}

// POST /reviews/edit/:id — admin only!!
async function editReview(req, res) {
    try {
        const { rating, comment } = req.body;

        const review = await Review.updateOne({ _id: req.params.id }, { rating, comment });

        if (review.matchedCount === 0) {
            return res.status(404).json({ success: false, message: "Review not found." });
        }

        res.json({ success: true });

    } catch (error) {
        console.error("EDIT REVIEW ERROR:", error);
        res.status(500).json({ success: false });
    }
}

// POST /reviews/delete/:id — admin only!!
async function deleteReview(req, res) {
    try {
        // flag it instead of deleting it
        const review = await Review.updateOne({ _id: req.params.id }, { archived: true });

        if (review.matchedCount === 0) {
            return res.status(404).json({ success: false, message: "Review not found." });
        }

        res.json({ success: true });

    } catch (error) {
        console.error("DELETE REVIEW ERROR:", error);
        res.status(500).json({ success: false });
    }
}

module.exports = { getReviews, createReview, editReview, deleteReview };
import express from "express";
import { 
    getTrending, 
    getTrailers, 
    getDetails, 
    getSimilar, 
    getCategory, 
    getReviews } 
    from "../controllers/movieTv.controller.js";

const router = express.Router();

router.get("/:type/trending", getTrending);
router.get("/:type/:id/trailers", getTrailers);
router.get("/:type/:id/details", getDetails);
router.get("/:type/:id/similar", getSimilar);
router.get("/:type/:category", getCategory);
router.get("/:type/:id/reviews", getReviews);

export default router;

import express from "express";
import { 
    trendingAllDay, trendingAllWeek,
    trendingMovieDay, trendingMovieWeek,
    trendingTVDay, trendingTVWeek,
    trendingPersonDay, trendingPersonWeek
 } from "../controllers/trending.controller.js";

const router = express.Router();

router.get("/all/day", trendingAllDay);
router.get("/all/week", trendingAllWeek);

router.get("/movie/day", trendingMovieDay);
router.get("/movie/week", trendingMovieWeek);

router.get("/tv/day", trendingTVDay);
router.get("/tv/week", trendingTVWeek);

router.get("/person/day", trendingPersonDay);
router.get("/person/week", trendingPersonWeek);

export default router;
// actor.route.js
import express from "express";
import { getActorDetails, getActorImages, getActorMovies, getActorTVs, getPopularPerson } from "../controllers/actor.controller.js";

const router = express.Router();

router.get("/:id", getActorDetails);

router.get("/:id/tv", getActorTVs)
router.get("/:id/movies", getActorMovies);
router.get("/:id/images", getActorImages);

router.get("/popular", getPopularPerson);

export default router;
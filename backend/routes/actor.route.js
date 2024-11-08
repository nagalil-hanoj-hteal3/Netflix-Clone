// actor.route.js
import express from "express";
import { getActorDetails } from "../controllers/actor.controller.js";

const router = express.Router();

router.get("/:id", getActorDetails);

export default router;
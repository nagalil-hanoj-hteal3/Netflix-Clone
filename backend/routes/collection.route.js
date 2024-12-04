import express from "express";
import {getDetails, getImages} from "../controllers/collection.controller.js";

const router = express.Router();

router.get("/:id/details", getDetails);
router.get("/:id/images", getImages);

export default router;
import express from "express";
import { searchMovie, searchPerson, searchTV, searchCollection, getSearchHistory, removeItemFromSearchHistory, addToSearchHistory } from "../controllers/search.controller.js";

const router = express.Router();

router.get("/person/:query", searchPerson);
router.get("/movie/:query", searchMovie);
router.get("/tv/:query", searchTV);
router.get("/collection/:query", searchCollection);

router.get("/history", getSearchHistory);
router.delete("/history/:id", removeItemFromSearchHistory);
router.post("/addHistory", addToSearchHistory);

export default router;
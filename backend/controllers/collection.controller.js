import { fetchFromTMDB } from "../services/tmdb.service.js";

export async function getDetails(req, res) {
    const {id} = req.params;
    try {
        const result = await fetchFromTMDB(`https://api.themoviedb.org/3/collection/${id}?language=en-US`);
        res.json({ success: true, content: result });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function getImages(req,res) {
    const {id} = req.params;
    try {
        const result = await fetchFromTMDB(`https://api.themoviedb.org/3/collection/${id}/images`);
        res.json({success: true, content: result});
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error"});
    }
}
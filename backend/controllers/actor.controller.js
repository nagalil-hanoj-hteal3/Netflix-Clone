// actor.controller.js
import { fetchFromTMDB } from "../services/tmdb.service.js";

export async function getActorDetails(req, res) {
    const { id } = req.params;
    try {
        const response = await fetchFromTMDB(`https://api.themoviedb.org/3/person/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`);
        res.status(200).json({ success: true, content: response });
    } catch (error) {
        console.log("Error fetching actor details:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

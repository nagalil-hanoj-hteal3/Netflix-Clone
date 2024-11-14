// actor.controller.js
import { fetchFromTMDB } from "../services/tmdb.service.js";

export async function getActorDetails(req, res) {
    const { id } = req.params;
    try {
        const response = await fetchFromTMDB(`https://api.themoviedb.org/3/person/${id}?language=en-US`);
        res.status(200).json({ success: true, content: response });
    } catch (error) {
        console.log("Error fetching actor details:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function getActorMovies(req, res) {
    const {id} = req.params;
    try {
        const response = await fetchFromTMDB(`https://api.themoviedb.org/3/person/${id}/movie_credits?language=en-US`);
        res.status(200).json({ success: true, content: response });
    } catch (error) {
        console.log("Error fetching actor movies:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function getActorTVs(req, res) {
    const {id} = req.params;
    try {
        const response = await fetchFromTMDB(`https://api.themoviedb.org/3/person/${id}/tv_credits?language=en-US`);
        res.status(200).json({ success: true, content: response });
    } catch (error) {
        console.log("Error fetching actor tv:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function getActorImages(req, res) {
    const { id } = req.params;
    try {
        const response = await fetchFromTMDB(`https://api.themoviedb.org/3/person/${id}/images?`);
        res.status(200).json({ success: true, content: response });
    } catch (error) {
        console.log("Error fetching actor images:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
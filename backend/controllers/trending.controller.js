import { fetchFromTMDB } from "../services/tmdb.service.js";

export async function trendingAllDay(req, res) {
    try {
        const response = await fetchFromTMDB(`https://api.themoviedb.org/3/trending/all/day?&include_adult=false&language=en-US&page=1`);
        res.status(200).json({success: true, content: response.results});
    } catch (error) {
        console.log("Error in trending all day function: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function trendingAllWeek(req, res) {
    try {
        const response = await fetchFromTMDB(`https://api.themoviedb.org/3/trending/all/week?&include_adult=false&language=en-US&page=1`);
        res.status(200).json({success: true, content: response.results})
    } catch (error) {
        console.log("Error in trending all week function: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function trendingMovieDay(req, res) {
    try {
        const response = await fetchFromTMDB(`https://api.themoviedb.org/3/trending/movie/day?&include_adult=false&language=en-US&page=1`);
        res.status(200).json({success: true, content: response.results})
    } catch (error) {
        console.log("Error in trending movie day function: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function trendingMovieWeek(req, res) {
    try {
        const response = await fetchFromTMDB(`https://api.themoviedb.org/3/trending/movie/week?&include_adult=false&language=en-US&page=1`);
        res.status(200).json({success: true, content: response.results})
    } catch (error) {
        console.log("Error in trending movie week function: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function trendingTVDay(req, res) {
    try {
        const response = await fetchFromTMDB(`https://api.themoviedb.org/3/trending/tv/day?&include_adult=false&language=en-US&page=1`);
        res.status(200).json({success: true, content: response.results})
    } catch (error) {
        console.log("Error in trending tv day function: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function trendingTVWeek(req, res) {
    try {
        const response = await fetchFromTMDB(`https://api.themoviedb.org/3/trending/tv/week?&include_adult=false&language=en-US&page=1`);
        res.status(200).json({success: true, content: response.results})
    } catch (error) {
        console.log("Error in trending tv week function: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function trendingPersonDay(req, res) {
    try {
        const response = await fetchFromTMDB(`https://api.themoviedb.org/3/trending/person/day?&include_adult=false&language=en-US&page=1`);
        res.status(200).json({success: true, content: response.results})
    } catch (error) {
        console.log("Error in trending person day function: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function trendingPersonWeek(req, res) {
    try {
        const response = await fetchFromTMDB(`https://api.themoviedb.org/3/trending/person/week?&include_adult=false&language=en-US&page=1`);
        res.status(200).json({success: true, content: response.results})
    } catch (error) {
        console.log("Error in trending person week function: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
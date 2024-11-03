import { fetchFromTMDB } from "../services/tmdb.service.js";

const MovieStrategy = {
    async getTrending() {
        const data = await fetchFromTMDB("https://api.themoviedb.org/3/movie/popular?language=en-US&page=1");
        return data.results[Math.floor(Math.random() * data.results?.length)];
    },
    async getTrailers(id) {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`);
        return data.results;
    },
    async getDetails(id) {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}?language=en-US`);
        return data;
    },
    async getSimilar(id) {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`);
        return data.results;
    },
    async getCategory(category) {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`);
        return data.results;
    },
    async getReviews (id) {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/reviews?language=en-US&page=1`);
        return data;
    }
}

export default MovieStrategy;
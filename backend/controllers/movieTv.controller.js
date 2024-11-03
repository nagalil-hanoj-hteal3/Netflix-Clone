import MovieStrategy from "../strategies/movie.strategy.js";
import TvStrategy from "../strategies/tv.strategy.js";

const strategies = {
    movie: MovieStrategy,
    tv: TvStrategy
};

export async function getTrending(req, res) {
    const { type } = req.params;
    const strategy = strategies[type];
    if (!strategy) {
        return res.status(400).json({ success: false, message: "Invalid type" });
    }
    try {
        const result = await strategy.getTrending();
        res.json({ success: true, content: result });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function getTrailers(req, res) {
    const { type, id } = req.params;
    const strategy = strategies[type];
    if (!strategy) {
        return res.status(400).json({ success: false, message: "Invalid type" });
    }
    try {
        const result = await strategy.getTrailers(id);
        res.json({ success: true, content: result });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function getDetails(req, res) {
    const {type, id} = req.params;
    const strategy = strategies[type];
    if (!strategy) {
        return res.status(400).json({ success: false, message: "Invalid type" });
    }
    try {
        const result = await strategy.getDetails(id);
        res.json({ success: true, content: result });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function getSimilar(req, res) {
    const {type, id} = req.params;
    const strategy = strategies[type];
    if (!strategy) {
        return res.status(400).json({ success: false, message: "Invalid type" });
    }
    try {
        const result = await strategy.getSimilar(id);
        res.json({ success: true, content: result });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

// under movie lists
export async function getCategory(req, res) {
    const {type, category} = req.params;
    const strategy = strategies[type];
    if (!strategy) {
        return res.status(400).json({ success: false, message: "Invalid type" });
    }
    try {
        const result = await strategy.getCategory(category);
        res.json({ success: true, content: result });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function getReviews(req, res) {
    const {type, id} = req.params;
    const strategy = strategies[type];
    if (!strategy) {
        return res.status(400).json({ success: false, message: "Invalid type" });
    }
    try {
        const result = await strategy.getReviews(id);
        res.json({ success: true, content: result });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
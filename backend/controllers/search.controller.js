import { fetchFromTMDB } from "../services/tmdb.service.js";
import { User } from "../models/user.model.js"

export async function searchPerson(req, res) {
    const {query} = req.params;
    try {
        const response = await fetchFromTMDB(`https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=1`);

        // nothing on search bar
        if(response.results.length === 0)
        {
            return res.status(404).send(null);
        }

        res.status(200).json({success: true, content: response.results});

    } catch (error) {
        console.log("Error in search person function: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function searchMovie(req, res) {
    const {query} = req.params;
    try {
        const response = await fetchFromTMDB(`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`);

        if(response.results.length === 0)
        {
            return res.status(404).send(null);
        }

        res.status(200).json({success: true, content: response.results});

    } catch (error) {
        console.log("Error in search movie function: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function searchTV(req, res) {
    const {query} = req.params;
    try {
        const response = await fetchFromTMDB(`https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`);

        if(response.results.length === 0)
        {
            return res.status(404).send(null);
        }

        res.status(200).json({success: true, content: response.results});

    } catch (error) {
        console.log("Error in search movie function: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
   
}

export async function searchCollection(req, res) {
    const {query} = req.params;
    try {
        const response = await fetchFromTMDB(`https://api.themoviedb.org/3/search/collection?query=${query}&include_adult=false&language=en-US&page=1`);

        if(response.results.length === 0)
        {
            return res.status(404).send(null);
        }

        res.status(200).json({success: true, content: response.results});
    } catch (error) {
        console.log("Error in search collection function: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function getSearchHistory(req, res) {
    try {
        res.status(200).json({success:true, content: req.user.searchHistory});
    } catch (error) {
        return res.status(500).json({success:false, message:"Internal error"});
    }
}

export async function removeItemFromSearchHistory(req, res) {
    // const {id} = req.params => a string value
    // important that id was set to string rather than int so it can delete
    let {id} = req.params;

    id = parseInt(id);
    
    try {
        await User.findByIdAndUpdate(req.user._id, {
            $pull: {
                searchHistory:{id:id},
            },
        });

        res.status(200).json({success:true, message: "Item removed from search history"});
    } catch (error) {
        console.log("Error in remove item from search function: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function addToSearchHistory(req, res) {
    const { id, image, title, searchType } = req.body;
    
    try {
        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                searchHistory: {
                    id: id,
                    image: image,
                    title: title,
                    searchType: searchType,
                    createdAt: new Date(),
                }
            }
        });

        res.status(200).json({success: true, message: "Added to search history"});
    } catch (error) {
        console.log("Error adding to search history: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
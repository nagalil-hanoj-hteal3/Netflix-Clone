// src/utils/searchUtils.js
import axios from "axios";
import toast from "react-hot-toast";

export const fetchSearchResults = async (type, term) => {
    try {
        const response = await axios.get(`/api/v1/search/${type}/${term}`);
        return response.data.content; // Return the search results
    } catch (error) {
        if (error.response && error.response.status === 404) {
            toast.error(`${term} is currently not in our database 😥. Please check again later!`);
        } else {
            toast.error("An error occurred, please try again later");
        }
        return [];
    }
};

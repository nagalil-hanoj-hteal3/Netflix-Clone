import axios from "axios";
import toast from "react-hot-toast";
import { MOVIE_GENRES, TV_GENRES } from "./constants";

export const fetchSearchResults = async (type, term) => {
    try {
        const response = await axios.get(`/api/v1/search/${type}/${term || ''}`);
        return response.data.content; // Return all search results
    } catch (error) {
        if (error.response && error.response.status === 404) {
            toast.error(`${term} is currently not in our database 😥. Please check again later!`);
        } else {
            toast.error("An error occurred, please try again later");
        }
        return [];
    }
};

export const FILTER_OPTIONS = {
    movie: {
        genres: MOVIE_GENRES,
        voteAverages: [
            { value: 1, label: '1+ Rating '},
            { value: 2, label: '2+ Rating '},
            { value: 3, label: '3+ Rating '},
            { value: 4, label: '4+ Rating '},
            { value: 5, label: '5+ Rating '},
            { value: 6, label: '6+ Rating '},
            { value: 7, label: '7+ Rating' },
            { value: 8, label: '8+ Rating' },
            { value: 9, label: '9+ Rating' },
            { value: 10, label: 'Perfect Rating' }
        ],
        releaseDates: [
            { value: '2020', label: '2020+' },
            { value: '2010', label: '2010+' },
            { value: '2000', label: '2000+' },
            { value: '1990', label: '1990+' },
            { value: '1980', label: '1980+' },
            { value: '1970', label: '1970+' },
            { value: '1960', label: '1960+' },
            { value: '1950', label: '1950+' },
        ]
    },
    tv: {
        genres: TV_GENRES,
        voteAverages: [
            { value: 1, label: '1+ Rating '},
            { value: 2, label: '2+ Rating '},
            { value: 3, label: '3+ Rating '},
            { value: 4, label: '4+ Rating '},
            { value: 5, label: '5+ Rating '},
            { value: 6, label: '6+ Rating '},
            { value: 7, label: '7+ Rating' },
            { value: 8, label: '8+ Rating' },
            { value: 9, label: '9+ Rating' },
            { value: 10, label: 'Perfect Rating' }
        ],
        releaseDates: [
            { value: '2020', label: '2020+' },
            { value: '2010', label: '2010+' },
            { value: '2000', label: '2000+' },
            { value: '1990', label: '1990+' },
            { value: '1980', label: '1980+' },
            { value: '1970', label: '1970+' },
            { value: '1960', label: '1960+' },
            { value: '1950', label: '1950+' },
        ]
    },
    person: {
        genders: [
            { id: 0, name: 'Not Specified' },
            { id: 1, name: 'Female' },
            { id: 2, name: 'Male' }, 
            { id: 3, name: 'Non-Binary'}
        ]
    }
};

export const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
};

// Utility function to get genre name by ID
export const getGenreNameById = (type, genreId) => {
    const genres = type === 'movie' ? MOVIE_GENRES : TV_GENRES;
    const genre = genres.find(g => g.id === Number(genreId));
    return genre ? genre.name : 'Unknown Genre';
};

// Client-side filtering function (optional, can be used in SearchPage)
export const filterSearchResults = (results, activeTab, filters, searchTerm) => {
    return results.filter(result => {
        // Genre filter
        if (filters.genre_id && (activeTab === 'movie' || activeTab === 'tv')) {
            const hasMatchingGenre = Array.isArray(filters.genre_id)
            ? filters.genre_id.every(genreId => 
                result.genre_ids?.includes(Number(genreId))
            )
            : result.genre_ids?.includes(Number(filters.genre_id));
        
        if (!hasMatchingGenre) return false;
        }

        // Vote average filter
        if (filters.vote_average && (activeTab === 'movie' || activeTab === 'tv')) {
            const meetsVoteAverage = result.vote_average >= Number(filters.vote_average);
            if (!meetsVoteAverage) return false;
        }

        // release date
        if (filters.release_date && (activeTab === 'movie' || activeTab === 'tv')) {
            const dateKey = activeTab === 'movie' ? 'release_date' : 'first_air_date';
            const releaseYear = result[dateKey] ? new Date(result[dateKey]).getFullYear() : null;
            const filterYear = Number(filters.release_date);
            
            if (!releaseYear || releaseYear < filterYear) return false;
        }

        // Gender filter for person
        if (filters.gender && activeTab === 'person') {
            const matchesGender = result.gender === Number(filters.gender);
            if (!matchesGender) return false;
        }

        // Search term filter (if applicable)
        if (searchTerm) {
            const lowercaseTerm = searchTerm.toLowerCase();
            const matchesTerm = 
                result.title?.toLowerCase().includes(lowercaseTerm) ||
                result.name?.toLowerCase().includes(lowercaseTerm);
            if (!matchesTerm) return false;
        }

        return true;
    });
};

export const getGenderNameById = (genderId) => {
    const genderMap = {
        0: 'Not Specified',
        1: 'Female',
        2: 'Male',
        3: 'Non-Binary'
    };
    return genderMap[Number(genderId)] || 'Unknown';
};
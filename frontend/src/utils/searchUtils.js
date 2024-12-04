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
            { value: 0, label: '0.0-0.9 Rating' },
            { value: 1, label: '1.0-1.9 Rating' },
            { value: 2, label: '2.0-2.9 Rating' },
            { value: 3, label: '3.0-3.9 Rating' },
            { value: 4, label: '4.0-4.9 Rating' },
            { value: 5, label: '5.0-5.9 Rating' },
            { value: 6, label: '6.0-6.9 Rating' },
            { value: 7, label: '7.0-7.9 Rating' },
            { value: 8, label: '8.0-8.9 Rating' },
            { value: 9, label: '9.0-9.9 Rating' },
            { value: 10, label: 'Perfect 10 Rating' }
        ],
        releaseDates: [
            { value: '2020-2029', label: '2020-2029' },
            { value: '2010-2019', label: '2010-2019' },
            { value: '2000-2009', label: '2000-2009' },
            { value: '1990-1999', label: '1990-1999' },
            { value: '1980-1989', label: '1980-1989' },
            { value: '1970-1979', label: '1970-1979' },
            { value: '1960-1969', label: '1960-1969' },
            { value: '1950-1959', label: '1950-1959' },
            { value: '1940-1949', label: '1940-1949' },
            { value: '1930-1939', label: '1930-1939' },
            { value: '1920-1929', label: '1920-1929' },
            { value: '1910-1919', label: '1910-1919' },
            { value: '1900-1909', label: '1900-1909' },
        ]
    },
    tv: {
        genres: TV_GENRES,
        voteAverages: [
            { value: 0, label: '0.0-0.9 Rating' },
            { value: 1, label: '1.0-1.9 Rating' },
            { value: 2, label: '2.0-2.9 Rating' },
            { value: 3, label: '3.0-3.9 Rating' },
            { value: 4, label: '4.0-4.9 Rating' },
            { value: 5, label: '5.0-5.9 Rating' },
            { value: 6, label: '6.0-6.9 Rating' },
            { value: 7, label: '7.0-7.9 Rating' },
            { value: 8, label: '8.0-8.9 Rating' },
            { value: 9, label: '9.0-9.9 Rating' },
            { value: 10, label: 'Perfect 10 Rating' }
        ],
        releaseDates: [
            { value: '2020-2029', label: '2020-2029' },
            { value: '2010-2019', label: '2010-2019' },
            { value: '2000-2009', label: '2000-2009' },
            { value: '1990-1999', label: '1990-1999' },
            { value: '1980-1989', label: '1980-1989' },
            { value: '1970-1979', label: '1970-1979' },
            { value: '1960-1969', label: '1960-1969' },
            { value: '1950-1959', label: '1950-1959' },
            { value: '1940-1949', label: '1940-1949' },
            { value: '1930-1939', label: '1930-1939' },
            { value: '1920-1929', label: '1920-1929' },
            { value: '1910-1919', label: '1910-1919' },
            { value: '1900-1909', label: '1900-1909' },
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

const normalizeString = (str) => {
    return str
        .toLowerCase()
        .replace(/[&+]/g, ' and ')
        .replace(/['-]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s/g, '')
};

// Client-side filtering function (optional, can be used in SearchPage)
export const filterSearchResults = (results, activeTab, filters, searchTerm) => {
    if (!searchTerm) return results;

    const normalizedSearchTerm = normalizeString(searchTerm);
    
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
            const lowerBound = Number(filters.vote_average);
            const upperBound = lowerBound === 10 ? 10 : lowerBound + 0.9;
            
            const meetsVoteAverage = result.vote_average >= lowerBound && 
                                    result.vote_average < upperBound;
            
            if (!meetsVoteAverage) return false;
        }

        // release date
        if (filters.release_date && (activeTab === 'movie' || activeTab === 'tv')) {
            const dateKey = activeTab === 'movie' ? 'release_date' : 'first_air_date';
            const releaseYear = result[dateKey] ? new Date(result[dateKey]).getFullYear() : null;
            
            if (filters.release_date) {
                const [startDecade, endDecade] = filters.release_date.split('-').map(Number);
                if (!releaseYear || releaseYear < startDecade || releaseYear > endDecade) return false;
            }
        }

        // Gender filter for person
        if (filters.gender && activeTab === 'person') {
            const matchesGender = result.gender === Number(filters.gender);
            if (!matchesGender) return false;
        }

        // Search term filter (if applicable)
        if (searchTerm) {
            const matchesTerm = 
                normalizeString(result.title || result.name || '').includes(normalizedSearchTerm) ||
                normalizeString(result.original_title || result.original_name || '').includes(normalizedSearchTerm);
            
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
import { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import WatchPageSkeleton from '../components/skeletons/WatchPageSkeleton';
import { getGenreNames } from '../utils/getGenreNames';
import { useContentStore } from '../store/content';
import { MOVIE_GENRES, TV_GENRES } from '../utils/constants';
import { Link } from 'react-router-dom';
import { User, ArrowUpRight } from "lucide-react";

function TrendingPage() {
    const [trendingData, setTrendingData] = useState([]);
    const [mediaType, setMediaType] = useState('all');
    const [timeWindow, setTimeWindow] = useState('day');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    console.log("test: ", trendingData);

    const getGenresForItem = (item) => {
        // Use the item's media_type to determine which genres to use
        return item?.media_type === "movie" ? MOVIE_GENRES : TV_GENRES;
    };

    const getImageUrl = (item) => {
        if(item?.poster_path || item?.profile_path) {
            return `https://image.tmdb.org/t/p/w500${item?.poster_path || item?.profile_path}`;
        }
    };

    // Helper function to get the correct link path based on media type
    const getLinkPath = (item) => {
        if (item?.media_type === 'person') {
            return `/actor/${item?.id}`;
        }
        return `/${item?.media_type}/moreinfo/${item?.id}`;
    };

    useEffect(() => {
        const fetchTrendingData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(
                    `/api/v1/trending/${mediaType}/${timeWindow}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch trending data');
                }

                const data = await response.json();
                setTrendingData(data?.content);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTrendingData();
    }, [mediaType, timeWindow]);

    return (
        <div className="min-h-screen bg-slate-900">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-4 text-white">Trending</h1>
                    
                    {/* Filter Controls */}
                    <div className="flex gap-4 mb-6">
                        <select
                            value={mediaType}
                            onChange={(e) => setMediaType(e.target.value)}
                            className="p-2 border rounded bg-slate-800 text-white border-slate-600 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All</option>
                            <option value="movie">Movies</option>
                            <option value="tv">TV Shows</option>
                            <option value="person">People</option>
                        </select>

                        <select
                            value={timeWindow}
                            onChange={(e) => setTimeWindow(e.target.value)}
                            className="p-2 border rounded bg-slate-800 text-white border-slate-600 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="day">Today</option>
                            <option value="week">This Week</option>
                        </select>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="text-center py-8">
                            <WatchPageSkeleton/>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="text-red-500 py-4 bg-slate-800 rounded-lg px-4">
                            Error: {error}
                        </div>
                    )}

                    {/* Results Grid */}
                    {!isLoading && !error && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {trendingData.map((item) => {
                                const genre_names = item?.genre_ids ? 
                                    getGenreNames(item?.genre_ids, getGenresForItem(item)) : "";
                                const imageUrl = getImageUrl(item);
                                return (
                                    <Link 
                                        to={getLinkPath(item)}
                                        key={item?.id}
                                        onClick={() => {
                                            // Only set content type for movies and TV shows
                                            if (item.media_type !== 'person') {
                                                useContentStore.getState().setContentType(item?.media_type);
                                            }
                                        }}
                                        className="block h-full"
                                    >
                                        <div 
                                            className="group flex flex-col h-full bg-slate-800 rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform duration-200 border border-slate-700"
                                        >
                                            <div className="relative w-full pt-[150%]">
                                                {imageUrl ? (
                                                    <img
                                                        src={imageUrl}
                                                        alt={item?.title || item?.name}
                                                        className="absolute top-0 left-0 w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-slate-700">
                                                        {item?.media_type === 'person' ? (
                                                            <User className="w-1/3 h-1/3 text-slate-400" />
                                                        ) : (
                                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                                <svg 
                                                                    className="w-1/3 h-1/3 mb-2" 
                                                                    fill="none" 
                                                                    stroke="currentColor" 
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path 
                                                                        strokeLinecap="round" 
                                                                        strokeLinejoin="round" 
                                                                        strokeWidth={2} 
                                                                        d="M7 4v16m10-16v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" 
                                                                    />
                                                                </svg>
                                                                <span className="text-sm">No Image</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                {item?.vote_average !== undefined && item?.vote_average !== null && (
                                                    <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
                                                        {item?.vote_average === 0 ? "N/A" : item?.vote_average.toFixed(1)}
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                                                    <div className="transform scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300">
                                                        <ArrowUpRight className="w-12 h-12 text-white p-2" strokeWidth={2.5} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col flex-grow p-4">
                                                <h3 className="font-semibold text-lg text-white mb-1">
                                                    {item?.title || item?.name}
                                                </h3>
                                                {item?.overview && (
                                                    <p className="text-slate-400 text-sm mb-2 line-clamp-2">
                                                        {item.overview}
                                                    </p>
                                                )}
                                                <div className="flex-grow">
                                                    {genre_names && (
                                                        <div className="flex flex-wrap gap-2 mb-2">
                                                            {genre_names?.split(", ").map((genre, index) => (
                                                                <span 
                                                                    key={index} 
                                                                    className="bg-blue-500/20 backdrop-blur-sm text-blue-200 px-2 py-0.5 rounded-full text-sm border border-blue-400/20"
                                                                >
                                                                    {genre}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                {(item.release_date || item.first_air_date) && (
                                                    <p className="text-slate-400 text-sm mt-auto">
                                                        {new Date(
                                                            item.release_date || item.first_air_date
                                                        ).getFullYear()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrendingPage;
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Calendar, ArrowUpRight } from 'lucide-react';
import { ORIGINAL_IMG_BASE_URL } from '../utils/constants';
import Navbar from '../components/Navbar';
import * as searchUtils from '../utils/searchUtils';
import { useContentStore } from "../store/content.js";
import Gallery from "../components/moreinfo/Gallery";

const CollectionsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // Add navigation
    const { contentType, setContentType } = useContentStore();
    const [collectionDetails, setCollectionDetails] = useState(null);
    const [collectionImages, setCollectionImages] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCollectionData = async () => {
            try {
                setIsLoading(true);
                const [detailsResponse, imagesResponse] = await Promise.all([
                    axios.get(`/api/v1/collection/${id}/details`),
                    axios.get(`/api/v1/collection/${id}/images`)
                ]);
                
                if (detailsResponse.data.success && imagesResponse.data.success) {
                    const details = detailsResponse.data.content;
                    setCollectionDetails(details);
                    setCollectionImages(imagesResponse.data.content);

                    // Determine collection type
                    const allMovies = details.parts.every(part => part.media_type === 'movie');
                    const allTVShows = details.parts.every(part => part.media_type === 'tv');

                    if (allMovies) {
                        setContentType('movie');
                    } else if (allTVShows) {
                        setContentType('tv');
                    } else {
                        // Mixed or unknown type
                        setContentType('movie'); // Default to movie, adjust as needed
                    }
                } else {
                    throw new Error('Failed to fetch collection data');
                }
            } catch (err) {
                console.error('Error fetching collection data:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCollectionData();
    }, [id, setContentType]);

    const handleMovieClick = (itemId, mediaType) => {
        try {
            // Dynamically navigate based on media type
            const navigationType = mediaType || contentType;
            
            if (navigationType === 'movie') {
                navigate(`/movie/moreinfo/${itemId}`);
            } else if (navigationType === 'tv') {
                navigate(`/tv/moreinfo/${itemId}`);
            } else {
                console.error('Unknown media type:', navigationType);
                alert('Unable to navigate to details. Please try again.');
            }
        } catch (error) {
            console.error('Navigation error:', error);
            alert('Unable to navigate to details. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
                <div className="animate-pulse text-white text-2xl">Loading Collection...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
                <div className="text-red-500 text-2xl">
                    Error: {error}
                    <button 
                        onClick={() => window.location.reload()}
                        className="ml-4 bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Early return if no parts are available
    if (!collectionDetails || !collectionDetails.parts || collectionDetails.parts.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
                <div className="text-white text-2xl">No movies found in this collection.</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
            <Navbar />
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/50 p-6 shadow-2xl shadow-blue-900/20">
                    {/* Back Button */}
                    <Link 
                        to="/search?tab=collection" 
                        className="inline-flex items-center text-white hover:text-blue-400 mb-6"
                    >
                        <ArrowLeft className="mr-2" /> Back to Search
                    </Link>

                    {/* Collection Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-4">
                            {collectionDetails.name}
                        </h1>
                        <p className="text-slate-400">
                            {collectionDetails.overview}
                        </p>
                    </div>

                    {/* Images Gallery */}
                    {collectionImages && collectionImages.backdrops.length > 0 && (
                        <Gallery 
                            contentImages={collectionImages} 
                            ORIGINAL_IMG_BASE_URL={ORIGINAL_IMG_BASE_URL}
                        />
                    )}

                    {/* Movies in Collection */}
                    <div>
                        <h2 className="text-2xl font-semibold text-white mb-4">
                        {contentType === 'tv' ? 'TV' : 'Movie'} in Collection
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {collectionDetails.parts.map((movie) => (
                                <div 
                                    key={movie.id} 
                                    onClick={() => handleMovieClick(movie.id)}
                                    className="bg-slate-900/60 rounded-xl overflow-hidden 
                                        border border-slate-800/50 shadow-lg 
                                        hover:scale-105 hover:shadow-xl 
                                        hover:shadow-blue-500/20 transition-all duration-300 group 
                                        cursor-pointer relative"
                                >
                                    <div className="absolute inset-0 z-10 
                                        bg-black/30 opacity-0 group-hover:opacity-100 
                                        transition-opacity duration-300 
                                        flex items-center justify-center pointer-events-none">
                                        <ArrowUpRight 
                                            className="size-12 text-white 
                                            drop-shadow-lg" 
                                            strokeWidth={2} 
                                        />
                                    </div>
                                    <div className="relative overflow-hidden">
                                        {movie.poster_path ? (
                                            <img
                                                src={ORIGINAL_IMG_BASE_URL + movie.poster_path}
                                                alt={movie.title}
                                                className="w-full h-auto object-cover 
                                                    transition-transform group-hover:scale-110 
                                                    group-hover:brightness-75"
                                            />
                                        ) : (
                                            <div className="w-full h-[300px] bg-slate-800 
                                                flex items-center justify-center text-slate-400">
                                                No Poster
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-white
                                            group-hover:text-blue-300 transition-colors mb-1">
                                            {movie.title}
                                        </h3>
                                        <div className="flex items-center text-sm text-slate-400 space-x-2">
                                            <Calendar className="size-4" />
                                            <span>{searchUtils.formatDate(movie.release_date)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollectionsPage;
import { useState } from 'react';
import { Link } from "react-router-dom";
import { Play, Info, SkipForward } from "lucide-react";
import Navbar from "../../components/Navbar";
import { MovieSlider } from "../../components/MovieSlider";
import useGetTrendingContent from "../../hooks/useGetTrendingContent";
import { MOVIE_CATEGORIES, ORIGINAL_IMG_BASE_URL, TV_CATEGORIES, MOVIE_GENRES, TV_GENRES } from "../../utils/constants";
import { useContentStore } from "../../store/content";
import { getGenreNames } from "../../utils/getGenreNames";
import HomeScreenLoader from "../../components/skeletons/LoadingContent.jsx";

const HomeScreen = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { trendingContent } = useGetTrendingContent(currentPage);
    const { contentType } = useContentStore();
    const [imgLoading, setImgLoading] = useState(true);
    const genres = contentType === "movie" ? MOVIE_GENRES : TV_GENRES;

    if (!trendingContent) {
        return (
            <HomeScreenLoader/>
        );
    }

    const handleNextTrending = () => {
        setCurrentPage((prevPage) => prevPage + 1);
        setImgLoading(true);
    };

    const genre_names = trendingContent?.genre_ids ?
        getGenreNames(trendingContent?.genre_ids, genres) : "";

    return (
        <div className="min-h-screen bg-slate-950">
            <Navbar />
            
            {/* Hero Section with Background Image */}
            <div className="relative min-h-[80vh]">
                {/* Background Image */}
                <div className="absolute inset-0 w-full h-full">
                    {imgLoading && (
                        <div className="absolute inset-0 bg-blue-900/30 animate-pulse" />
                    )}
                    <img
                        src={ORIGINAL_IMG_BASE_URL + trendingContent?.backdrop_path}
                        alt="Background"
                        className="w-full h-full object-cover"
                        onLoad={() => setImgLoading(false)}
                    />
                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 lg:px-8 py-32">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                            {trendingContent?.title || trendingContent?.name}
                        </h1>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                            {genre_names ? (
                                genre_names.split(", ").map((genre, index) => (
                                    <span 
                                        key={index} 
                                        className="bg-blue-500/20 backdrop-blur-sm text-blue-200 px-4 py-1 rounded-full text-sm border border-blue-400/20"
                                    >
                                        {genre}
                                    </span>
                                ))
                            ) : null}
                        </div>

                        <p className="text-blue-200 mb-4 text-lg">
                            {trendingContent?.release_date?.split("-")[0] || trendingContent?.first_air_date?.split("-")[0]}{" "} 
                            | {trendingContent?.adult ? "18+" : "PG-13"}
                        </p>

                        <p className="text-slate-300 mb-8 text-lg max-w-2xl leading-relaxed">
                            {trendingContent?.overview?.length > 150 ? `${trendingContent.overview.slice(0, 150)}...` : trendingContent?.overview }
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link
                                to={`/watch/${trendingContent?.id}`}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <Play className="size-5" /> Watch Now
                            </Link>

                            <Link
                                to={`/${contentType}/moreinfo/${trendingContent?.id}`}
                                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white py-3 px-8 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <Info className="size-5" /> Details
                            </Link>

                            <button
                                onClick={handleNextTrending}
                                className="bg-slate-800/30 hover:bg-slate-800/50 backdrop-blur-sm text-white py-3 px-8 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                Next <SkipForward className="size-5"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories Section */}
            <div className="container mx-auto px-4 lg:px-8 py-12">
                <div className="space-y-12 py-11">
                    {contentType === "movie" 
                        ? MOVIE_CATEGORIES.map((category) => (
                            <div key={category} className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-slate-800">
                                <MovieSlider category={category} />
                            </div>
                        ))
                        : TV_CATEGORIES.map((category) => (
                            <div key={category} className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-slate-800">
                                <MovieSlider category={category} />
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default HomeScreen;
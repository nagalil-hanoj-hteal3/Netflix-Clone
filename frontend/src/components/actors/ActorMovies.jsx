/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { Film, ChevronLeft, ChevronRight } from "lucide-react";
import { ORIGINAL_IMG_BASE_URL } from "../../utils/constants";
import { useContentStore } from "../../store/content";

export const ActorMovies = ({
    actorMovies, scrollPositions, movieScrollRef, scrollLeft, scrollRight, openModal
}) => {
    const consolidatedMovies = actorMovies.reduce((acc, movie) => {
        const existingMovie = acc.find(m => m.id === movie.id);
        if (existingMovie) {
            // If movie already exists, append the new role to characters
            if (movie.character && !existingMovie.characters.includes(movie.character)) {
                existingMovie.characters.push(movie.character);
            }
            return acc;
        }
        // If movie doesn't exist, add it with characters array
        return [...acc, { ...movie, characters: [movie.character].filter(Boolean) }];
    }, []);

    if (actorMovies.length === 0) return null;

    return (
        <div className="relative space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-semibold text-blue-400 flex items-center gap-2">
                    <Film />
                    <span>Movies</span>
                </h2>
                <button 
                    onClick={() => openModal("All Movies", [...new Map(actorMovies.filter(movie => movie.poster_path).map(movie => [movie.id, movie])).values()])}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-full text-white transition-colors"
                >
                    View All
                </button>
            </div>

            <div className="relative group">
                {!scrollPositions.movies.isAtStart && (
                    <button
                        onClick={() => scrollLeft(movieScrollRef, 'movies')}
                        className="absolute left-0 z-10 p-3 bg-slate-800/90 rounded-full top-1/2 transform -translate-y-1/2 shadow-xl hover:bg-slate-700/90 transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                )}
                
                <div ref={movieScrollRef} className="flex overflow-x-scroll gap-6 p-4 scrollbar-hide">
                    {consolidatedMovies.filter(movie => movie.poster_path).map((movie, idx) => (
                        <Link 
                            key={idx}
                            to={`/movie/moreinfo/${movie.id}`}
                            onClick={() => useContentStore.getState().setContentType('movie')}
                            className="relative flex-shrink-0"
                        >
                            <div className="w-64 h-96 overflow-hidden rounded-lg relative">
                                <img
                                    src={`${ORIGINAL_IMG_BASE_URL}${movie.poster_path}`}
                                    alt={movie.title}
                                    className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                <div className="space-y-1">
                                    <p className="text-white font-medium">{movie.title}</p>
                                    {movie.characters.length > 0 && (
                                        <p className="text-blue-300 text-sm">as {movie.characters.join(", ")}</p>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {!scrollPositions.movies.isAtEnd && (
                    <button
                        onClick={() => scrollRight(movieScrollRef, 'movies')}
                        className="absolute right-0 z-10 p-3 bg-slate-800/90 rounded-full top-1/2 transform -translate-y-1/2 shadow-xl hover:bg-slate-700/90 transition-colors"
                    >
                        <ChevronRight size={24} />
                    </button>
                )}
            </div>
        </div>
    )
};

export default ActorMovies;
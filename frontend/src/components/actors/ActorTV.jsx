/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { Tv, ChevronLeft, ChevronRight } from "lucide-react";
import { ORIGINAL_IMG_BASE_URL } from "../../utils/constants";
import { useContentStore } from "../../store/content";

export const ActorTV = ({
    actorTVs, scrollPositions, tvScrollRef, scrollLeft, scrollRight, openModal
}) => {
    const consolidatedTVs = actorTVs.reduce((acc, show) => {
        const existingShow = acc.find(s => s.id === show.id);
        if (existingShow) {
            // If show already exists, append the new role to characters
            if (show.character && !existingShow.characters.includes(show.character)) {
                existingShow.characters.push(show.character);
            }
            return acc;
        }
        // If show doesn't exist, add it with characters array
        return [...acc, { ...show, characters: [show.character].filter(Boolean) }];
    }, []);

    if (actorTVs.length === 0) return null;

    return (
        <div className="relative space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-semibold text-blue-400 flex items-center gap-2">
                    <Tv />
                    <span>TV Shows</span>
                </h2>
                <button 
                    onClick={() => openModal("All TV Shows", [...new Map(actorTVs.filter(tv => tv.poster_path).map(tv => [tv.id, tv])).values()])}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-full text-white transition-colors"
                >
                    View All
                </button>
            </div>

            <div className="relative group">
                {!scrollPositions.tvShows.isAtStart && (
                    <button
                        onClick={() => scrollLeft(tvScrollRef, 'tvShows')}
                        className="absolute left-0 z-10 p-3 bg-slate-800/90 rounded-full top-1/2 transform -translate-y-1/2 shadow-xl hover:bg-slate-700/90 transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                )}
                
                <div ref={tvScrollRef} className="flex overflow-x-scroll gap-6 p-4 scrollbar-hide">
                    {consolidatedTVs.filter(tv => tv.poster_path).map((show, idx) => (
                        <Link 
                            key={idx}
                            to={`/tv/moreinfo/${show.id}`}
                            className="relative flex-shrink-0"
                            onClick={() => useContentStore.getState().setContentType('tv')}
                        >
                            <div className="w-64 h-96 overflow-hidden rounded-lg shadow-lg">
                                <img
                                    src={`${ORIGINAL_IMG_BASE_URL}${show.poster_path}`}
                                    alt={show.name}
                                    className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                <div className="space-y-1">
                                    <p className="text-white font-medium">{show.name}</p>
                                    {show.characters.length > 0 && (
                                        <p className="text-blue-300 text-sm">as {show.characters.join(", ")}</p>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {!scrollPositions.tvShows.isAtEnd && (
                    <button
                        onClick={() => scrollRight(tvScrollRef, 'tvShows')}
                        className="absolute right-0 z-10 p-3 bg-slate-800/90 rounded-full top-1/2 transform -translate-y-1/2 shadow-xl hover:bg-slate-700/90 transition-colors"
                    >
                        <ChevronRight size={24} />
                    </button>
                )}
            </div>
        </div>
    )
};

export default ActorTV;
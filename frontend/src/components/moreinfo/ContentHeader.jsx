/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import { Play, Award, Star, Calendar, Clock, Eye, EyeOff, Bookmark } from 'lucide-react';
import { ORIGINAL_IMG_BASE_URL } from '../../utils/constants';
import { formatReleaseDate } from '../../utils/dateFunction';
import StarRating from '../../components/StarRating';
import InfoIconWithTooltip from '../../components/InfoIconWithTooltip';
import TV_Modal from "../../components/TV_Modal";

export const ContentHeader = ({
    content,
    id,
    contentType,
    uniqueMembers,
    handleBookmark,
    isBookmarked
}) => {
    const score = content?.vote_average || 0;

    return (
        <div className="flex flex-col lg:flex-row gap-8 lg:mb-28 mb-10">
            {/* Poster */}
            <div className="lg:w-1/4 flex-shrink-0">
                <div className="rounded-xl overflow-hidden shadow-2xl transform hover:scale-105 transition duration-300">
                    <img
                        loading="lazy"
                        src={content?.poster_path ? `${ORIGINAL_IMG_BASE_URL}${content?.poster_path}` : '/unavailable.jpg'}
                        alt={content?.title || content?.name}
                        className="w-full h-auto object-cover"
                    />
                </div>
            </div>

            {/* Movie Info */}
            <div className="lg:w-3/4 space-y-6 flex-grow min-w-0">
                {/* Title and Trailer Button */}
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="min-w-0 flex-grow">
                        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 break-words pr-4 flex items-start gap-2">
                            <span>{content?.title || content?.name}</span>
                            <InfoIconWithTooltip content={content} />
                        </h1>
                        {content?.tagline && (
                            <p className="text-base lg:text-lg text-gray-300 italic line-clamp-2">"{content.tagline}"</p>
                        )}
                        {uniqueMembers.some(member => member.role === "Director") && (
                            <p className="text-sm lg:text-base text-gray-400 mt-2">
                                Directed by: {" "}
                                <span className="text-white font-medium">
                                    {uniqueMembers.filter(member => member.role === "Director")
                                        .map(director => director.name)
                                        .join(", ")}
                                </span>
                            </p>
                        )}
                    </div>
                    <div className="flex flex-row items-center justify-start gap-2">
                        <Link 
                            to={`/watch/${id}`}
                            className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white 
                                    rounded-full font-medium transition-all duration-200 shadow-lg hover:scale-105
                                    whitespace-nowrap flex-shrink-0"
                        >
                            <Play className="size-5 mr-2"/>
                            Watch Trailer
                        </Link>
                        { !isBookmarked && (
                            <button 
                                onClick={handleBookmark}
                                className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                            >
                                <Bookmark className="size-6" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2">
                    {content?.genres?.map((genre) => (
                        <span
                            key={genre.id}
                            className="px-3 py-1 bg-gray-800/80 text-gray-200 rounded-full text-sm
                                    backdrop-blur-sm border border-gray-700 flex items-center"
                        >
                            <Award className="size-3 mr-1.5 text-blue-400"/>
                            {genre.name}
                        </span>
                    ))}
                </div>

                {/* Metrics */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-gray-300">
                    {score !== undefined && score !== null && (
                        <div className="flex items-center gap-2">
                            <div className="px-3 py-1 bg-blue-500/20 rounded-lg text-blue-400 font-semibold flex items-center">
                                <Star className="size-4 mr-1.5"/>
                                {score.toFixed(1)}/10
                            </div>
                            <StarRating rating={score/2} maxStars={5} size="w-5 h-5" />
                        </div>
                    )}
                    <span className="flex items-center"><Calendar className="size-4 mr-1.5 text-gray-400"/>{formatReleaseDate(content?.release_date || content?.first_air_date)}</span>
                        {content?.runtime && (
                            <span className="flex items-center">
                                <Clock className="size-4 mr-1.5 text-gray-400"/>
                                {Math.floor(content.runtime / 60)}h {content.runtime % 60}m</span>
                        )}
                    <span className={`font-medium flex items-center gap-1.5 ${content?.adult ? "text-red-500" : "text-green-500"}`}>
                        {content?.adult ? (
                            <EyeOff className="size-4" /> ) :
                        (
                            <Eye className="size-4"/>
                        )}
                        
                        {content?.adult ? "18+" : "PG-13"}
                    </span>
                </div>

                {/* Overview */}
                <p className="text-base lg:text-lg leading-relaxed text-gray-300">
                    {content?.overview}
                </p>

                {/* TV Show Episodes Modal */}
                {contentType === "tv" && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                        <TV_Modal content={content} />
                    </div>
                )}
            </div>
        </div>
    );

};

export default ContentHeader;
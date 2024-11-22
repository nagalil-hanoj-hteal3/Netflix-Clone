/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { Info, X } from "lucide-react";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import StarRating from "../components/StarRating";

export const TVInfoModal = ({ content }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('about'); // 'about' or 'seasons'

    const handleModalOpen = () => setIsModalOpen(true);
    const handleModalClose = () => setIsModalOpen(false);

    const formatReleaseDate = (date) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div>
        <button
            onClick={handleModalOpen}
            className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 ml-auto"
        >
            <Info className="w-5 h-5" />
            TV Show Details
        </button>

        {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
                <div className="bg-gray-900 text-white w-11/12 max-w-4xl p-6 rounded-lg relative overflow-y-auto max-h-[90vh]">
                    {/* Close Button */}
                    <button className="absolute top-4 right-4 text-gray-300 hover:text-white"
                    onClick={handleModalClose}>
                        <X className="w-6 h-6" />
                    </button>

                    {/* Tabs */}
                    <div className="flex gap-4 mb-6 border-b border-gray-700">
                        <button className={`pb-2 px-4 ${activeTab === 'about' ? 'border-b-2 border-red-500 text-red-500' : 'text-gray-400'}`}
                            onClick={() => setActiveTab('about')}>
                            About Show
                        </button>
                        {content?.seasons?.length > 0 && (
                            <button className={`pb-2 px-4 ${activeTab === 'seasons' ? 'border-b-2 border-red-500 text-red-500' : 'text-gray-400'}`}
                            onClick={() => setActiveTab('seasons')}>
                                Seasons
                            </button>
                        )}
                    </div>

                    {/* About Content */}
                    {activeTab === 'about' && (
                        <div className="space-y-6">
                            {/* General Info */}
                            <div className="bg-gray-800/50 p-4 rounded-lg">
                                <h3 className="text-xl font-semibold mb-3">Show Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-400">First Air Date</p>
                                        <p className="text-lg">{formatReleaseDate(content?.first_air_date)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Last Air Date</p>
                                        <p className="text-lg">{formatReleaseDate(content?.last_air_date)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Status</p>
                                        <p className={`text-lg ${content?.in_production ? "text-green-500" : "text-red-500"}`}>
                                            {content?.in_production ? "In Production" : "Ended"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Episodes</p>
                                        <p className="text-lg">{content?.number_of_episodes || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Seasons</p>
                                        <p className="text-lg">{content?.number_of_seasons || "N/A"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Last Episode */}
                            {content?.last_episode_to_air && (
                            <div className="bg-gray-800/50 p-4 rounded-lg">
                                <h3 className="text-xl font-semibold mb-3">Last Episode</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-lg font-medium">{content?.last_episode_to_air.name}</h4>
                                            <p className="text-gray-400">Episode {content?.last_episode_to_air.episode_number}</p>
                                        </div>
                                        {content?.last_episode_to_air.vote_average > 0 && (
                                        
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm">{(content?.last_episode_to_air?.vote_average).toFixed(1)}</p>
                                            <StarRating rating={content?.last_episode_to_air.vote_average/2} maxStars={5} size="w-6 h-6"/>
                                        </div>
                                        )}
                                    </div>
                                    <p>{content?.last_episode_to_air.overview}</p>
                                    {content?.last_episode_to_air.still_path && (
                                        <img
                                        src={`${ORIGINAL_IMG_BASE_URL}${content?.last_episode_to_air.still_path}`}
                                        alt={content?.last_episode_to_air.name}
                                        className="w-full rounded-lg mt-2"
                                        />
                                    )}
                                </div>
                            </div>
                            )}

                            {/* Next Episode */}
                            {content?.next_episode_to_air && (
                            <div className="bg-gray-800/50 p-4 rounded-lg">
                                <h3 className="text-xl font-semibold mb-3">Next Episode</h3>
                                <div className="space-y-3">
                                    <h4 className="text-lg font-medium">{content?.next_episode_to_air.name}</h4>
                                    <p className="text-gray-400">Episode {content?.next_episode_to_air.episode_number}</p>
                                    <p>{content?.next_episode_to_air.overview}</p>
                                    {content?.next_episode_to_air.still_path && (
                                        <img
                                        src={`${ORIGINAL_IMG_BASE_URL}${content?.next_episode_to_air.still_path}`}
                                        alt={content?.next_episode_to_air.name}
                                        className="w-full rounded-lg mt-2"
                                        />
                                    )}
                                </div>
                            </div>
                            )}
                        </div>
                    )}

                    {/* Seasons Content */}
                    {activeTab === 'seasons' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {content?.seasons.map((season) => (
                        <div key={season.season_number} className="bg-gray-800 p-4 rounded-lg">
                            {season.poster_path && (
                            <img src={`${ORIGINAL_IMG_BASE_URL}${season.poster_path}`}
                                alt={season.name}
                                className="w-full h-48 object-cover rounded-lg mb-3"/>
                            )}
                            <h4 className="text-lg font-semibold">{season.name}</h4>
                            <p className="text-sm text-gray-400">
                                Air Date: {formatReleaseDate(season.air_date)}
                            </p>
                            <p className="text-sm text-gray-400">
                                Episodes: {season.episode_count}
                            </p>
                            {season.vote_average > 0 && (
                            <div className="mt-2">
                                <p className="text-sm text-gray-400 mb-3">Rating: {season.vote_average}</p>
                                <StarRating rating={season.vote_average/2} maxStars={5} size="w-6 h-6"/>
                            </div>
                            )}
                        </div>
                        ))}
                    </div>
                    )}
                </div>
            </div>
        )}
        </div>
    );
    };

export default TVInfoModal;
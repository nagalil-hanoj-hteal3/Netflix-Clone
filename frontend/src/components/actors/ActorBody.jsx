/* eslint-disable react/prop-types */
import {Calendar, MapPin, User, Globe, Share2, Star, ExternalLink} from "lucide-react";
import { calculateAge, getGenderInfo } from "../../utils/actorUtils";

export const ActorBody = ({ actorDetails, showBio, setShowBio }) => (
    <div className="space-y-8 backdrop-blur-sm bg-slate-900/50 p-8 rounded-2xl shadow-xl">
        <div className="space-y-4">
            <h2 className="text-3xl font-semibold text-blue-400">Biography</h2>
            <p className="text-slate-300 leading-relaxed">
                {showBio ? actorDetails?.biography : `${actorDetails?.biography.slice(0, 400)}`}
                {actorDetails?.biography.length > 400 && (
                    <button
                        onClick={() => setShowBio(!showBio)}
                        className="ml-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        {showBio ? "See Less" : "See More"}
                    </button>
                )}
            </p>
        </div>

        <div className="space-y-4">
            <h2 className="text-3xl font-semibold text-blue-400">Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                    <Calendar className="text-blue-400" />
                    <div>
                        <p className="text-slate-400 text-sm">Birthday</p>
                        <p className="text-slate-200">
                            {actorDetails?.birthday ? (
                            <>
                                {actorDetails?.birthday} 
                                {actorDetails?.deathday 
                                ? ` - ${actorDetails?.deathday} (Age: ${calculateAge(actorDetails?.birthday, actorDetails?.deathday)})` 
                                : ` (Age: ${calculateAge(actorDetails?.birthday, actorDetails?.deathday)})`
                                }
                            </>
                            ) : "N/A"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <MapPin className="text-blue-400" />
                    <div>
                        <p className="text-slate-400 text-sm">Place of Birth</p>
                        <p className="text-slate-200">{actorDetails?.place_of_birth || "N/A"}</p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <User className="text-blue-400" />
                    <div>
                        <p className="text-slate-400 text-sm">Gender</p>
                        <p className="text-slate-200">
                        {(() => {
                            const genderInfo = getGenderInfo(actorDetails?.gender);
                            return (
                                <span className={`font-medium ${genderInfo.color}`}>
                                    {genderInfo.text}
                                </span>
                            );
                        })()}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <Star className="text-blue-400" />
                    <div className="w-full">
                        <p className="text-slate-400 text-sm">Popularity</p>
                        <div className="w-full bg-slate-800 rounded-full h-2.5">
                            <div 
                                className="bg-blue-600 h-2.5 rounded-full mt-2" 
                                style={{
                                    width: `${Math.min(actorDetails?.popularity / 3, 100)}%`
                                }}
                            ></div>
                        </div>
                        <p className="text-slate-200">{actorDetails?.popularity}</p>
                    </div>
                </div>

                {actorDetails?.also_known_as && actorDetails.also_known_as.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-xl font-semibold text-blue-400 mb-2">Also Known As</h3>
                        <div className="flex flex-wrap gap-2">
                            {actorDetails.also_known_as.map((name, index) => (
                                <span 
                                key={index} 
                                className="bg-slate-700 text-slate-200 px-2 py-1 rounded text-sm"
                                >
                                {name}
                                </span>
                            ))}
                        </div>
                    </div>
                    )}
                
                    {(actorDetails?.homepage || actorDetails?.imdb_id) && (
                        <div className="flex space-x-4 mt-4">
                            {/* Homepage Link */}
                            <div className="flex flex-col gap-3 mt-4">
                                <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
                                    <Share2 className="size-4 text-blue-400" />
                                    External Links
                                </h3>
                                
                                <div className="flex flex-wrap items-start gap-3">
                                    {actorDetails?.homepage && (
                                        <a
                                            href={actorDetails.homepage}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 
                                                    text-blue-400 hover:text-blue-300 rounded-lg transition-all 
                                                    duration-200 hover:bg-slate-700/80 border border-slate-700
                                                    hover:scale-105"
                                        >
                                            <Globe className="size-4" />
                                            <span>Official Website</span>
                                        </a>
                                    )}

                                    {actorDetails?.imdb_id && (
                                        <a
                                            href={`https://www.imdb.com/name/${actorDetails.imdb_id}/`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 
                                                    text-blue-400 hover:text-blue-300 rounded-lg transition-all 
                                                    duration-200 hover:bg-slate-700/80 border border-slate-700
                                                    hover:scale-105"
                                        >
                                            <ExternalLink className="size-4" />
                                            <span>IMDb Profile</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
            </div>
        </div>
    </div>
);
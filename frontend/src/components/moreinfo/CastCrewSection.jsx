/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, User } from "lucide-react";
import { ORIGINAL_IMG_BASE_URL } from "../../utils/constants";

const CastCrewSection = ({ 
    combinedMembers, 
    castSliderRef, 
    canScrollStates, 
    uniqueMembers,
    scroll
}) => {
    const [filterRole, setFilterRole] = useState("Cast & Crew");

    // Determine initial filter role based on available members
    useEffect(() => {
        const hasCastMembers = combinedMembers?.some(member => member.role === "Cast" && member.profile_path);
        const hasCrewMembers = combinedMembers?.some(member => 
            (member.role === "Crew" || member.role === "Director") && 
            member.profile_path
        );

        if (hasCastMembers && !hasCrewMembers) {
            setFilterRole("Cast");
        } else if (!hasCastMembers && hasCrewMembers) {
            setFilterRole("Crew");
        } else if (hasCastMembers && hasCrewMembers) {
            setFilterRole("Cast & Crew");
        }
    }, [combinedMembers]);


    // Filtering members based on selected role
    const filteredMembers = uniqueMembers?.filter((member) => {
        if (filterRole === "Cast") return member.role === "Cast";
        if (filterRole === "Crew") return member.role === "Crew" && member.job !== "Director";
        if (filterRole === "Director") { 
            const isDirector = member.role === "Director" || member.job === "Director";
            return isDirector;
        }
        return true; // "Cast & Crew" shows all
    }) || [];

    // Determine if we should show the cast/crew section
    const hasCastMembers = combinedMembers?.some(member => member.role === "Cast" && member.profile_path);
    const hasCrewMembers = combinedMembers?.some(member => 
        (member.role === "Crew" || member.role === "Director") && 
        member.profile_path
    );

    // If no members, return null
    if (!hasCastMembers && !hasCrewMembers) return null;

    return (
        <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white">{filterRole}</h2>
                <select 
                    value={filterRole} 
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-700
                            hover:bg-slate-700 focus:ring-2 focus:ring-blue-400 focus:outline-none
                            transition-colors duration-200"
                >
                    {hasCastMembers && hasCrewMembers && (
                        <option value="Cast & Crew">Cast & Crew</option>
                    )}
                    {hasCastMembers && (
                        <option value="Cast">Cast</option>
                    )}
                    {hasCrewMembers && (
                        <option value="Crew">Crew</option>
                    )}
                    {combinedMembers.some(member => member.job === 'Director') && (
                        <option value="Director">Director</option>
                    )}
                </select>
            </div>

            <div className="relative group">
                <div ref={castSliderRef} className="flex gap-6 overflow-x-scroll scrollbar-hide pb-6">
                    {filteredMembers?.map((member) => (
                        <Link
                            to={`/actor/${member.id}`}
                            key={`${member.id}-${member.role}`}
                            className="flex-none w-36 group/card"
                        >
                            <div className="rounded-xl overflow-hidden bg-gray-800 shadow-lg 
                                        transform transition duration-300 hover:scale-105">
                                {member.profile_path ? (
                                    <img
                                        loading="lazy"
                                        src={`${ORIGINAL_IMG_BASE_URL}${member.profile_path}`}
                                        alt={member.name}
                                        className="w-full aspect-[2/3] object-cover"
                                    />
                                ) : (
                                    <div className="w-full aspect-[2/3] bg-gray-700 flex items-center justify-center">
                                        <User className="w-12 h-12 text-gray-400" />
                                    </div>
                                )}
                                <div className="p-3">
                                    <h3 className="font-medium text-white truncate">{member.name}</h3>
                                    <p className="text-sm text-gray-400 truncate">
                                        {member.character || member.job || "Role Unspecified"}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                {canScrollStates.cast?.left && (
                    <button
                        onClick={() => scroll('left', castSliderRef, 'cast')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 p-3 z-10
                                bg-blue-600/90 hover:bg-blue-500 backdrop-blur rounded-full 
                                transition-all duration-300 opacity-0 group-hover:opacity-100
                                shadow-lg hover:shadow-blue-500/50 transform hover:-translate-x-1"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                )}
                {canScrollStates.cast?.right && (
                    <button
                        onClick={() => scroll('right', castSliderRef, 'cast')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 p-3 z-10
                                bg-blue-600/90 hover:bg-blue-500 backdrop-blur rounded-full 
                                transition-all duration-300 opacity-0 group-hover:opacity-100
                                shadow-lg hover:shadow-blue-500/50 transform hover:translate-x-1"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-6 h-6 text-white" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default CastCrewSection;
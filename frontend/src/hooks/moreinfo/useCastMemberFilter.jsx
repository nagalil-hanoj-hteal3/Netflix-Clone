import { useState, useEffect } from 'react';

export const useCastMemberFilter = (castMember) => {
    const [filterRole, setFilterRole] = useState("Cast & Crew");

    // Combine cast and crew members
    const combinedMembers = [
        ...(castMember?.cast?.map(member => ({ ...member, role: 'Cast' })) || []),
        ...(castMember?.crew?.map(member => ({ 
            ...member, 
            role: member.job === 'Director' ? 'Director' : 'Crew' 
        })) || [])
    ];

    // Check if there are cast or crew members with profile pictures
    const hasCastMembers = combinedMembers?.some(
        member => member.role === "Cast" && member.profile_path
    );
    const hasCrewMembers = combinedMembers?.some(
        member => (member.role === "Crew" || member.role === "Director") && 
        member.profile_path
    );

    // Automatically set filter role based on available members
    useEffect(() => {
        if (hasCastMembers && !hasCrewMembers) {
            setFilterRole("Cast");
        } else if (!hasCastMembers && hasCrewMembers) {
            setFilterRole("Crew");
        } else if (hasCastMembers && hasCrewMembers) {
            setFilterRole("Cast & Crew");
        }
    }, [castMember, hasCastMembers, hasCrewMembers]);

    // Remove duplicate members
    const uniqueMembersMap = new Map();
    combinedMembers.forEach(member => {
        const existingMember = uniqueMembersMap.get(member.id);
        if (!uniqueMembersMap.has(member.id)) {
            uniqueMembersMap.set(member.id, member);
        } else {
            // Update with more specific role information
            if (
                member.job === 'Director' || 
                member.role === 'Director' || 
                (existingMember.role !== 'Director' && member.role === 'Director')
            ) {
                uniqueMembersMap.set(member.id, member);
            }
        }
    });

    const uniqueMembers = Array.from(uniqueMembersMap.values());

    return {
        combinedMembers,
        uniqueMembers,
        filterRole,
        setFilterRole,
        hasCastMembers,
        hasCrewMembers
    };
};
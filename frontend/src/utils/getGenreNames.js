export const getGenreNames = (genreIds, categories) => {
    const genreMap = categories.reduce((acc, { id, name }) => {
        acc[id] = name;
        return acc;
    }, {});

    // Map genre IDs to names
    return genreIds.map((id) => genreMap[id] || "Unknown").join(", ");
};

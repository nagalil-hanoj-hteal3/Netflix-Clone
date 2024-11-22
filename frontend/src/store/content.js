import { create } from "zustand";

export const useContentStore = create((set) => ({
	contentType: "movie",
	setContentType: (type) => set({ contentType: type }),
	searchResults: [],
	actorMap: {},
	setSearchResults: (results) => set(() => {
        // Create a map of actors by ID for quick lookup
        const actorMap = results.reduce((map, actor) => {
            map[actor.id] = actor;
            return map;
        }, {});

		// console.log("map: ", actorMap);

        return { searchResults: results, actorMap };
    }),
    setContentTypeFromPath: (path) => {
        if (path.includes('/movie/')) {
            set({ contentType: 'movie' });
        } else if (path.includes('/tv/')) {
            set({ contentType: 'tv' });
        } else if (path.includes('/actor/')) {
            set({ contentType: 'person' });
        }
    }
}));
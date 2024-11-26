import { create } from "zustand";
import { persist } from "zustand/middleware"; // Import persist middleware

export const useContentStore = create(
    persist(
        (set) => ({
            contentType: "movie",
            setContentType: (type) => set({ contentType: type }),
            searchResults: [],
            actorMap: {},
            setSearchResults: (results) => set(() => {
            const actorMap = results.reduce((map, actor) => {
                map[actor.id] = actor;
                return map;
            }, {});
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
        }),
        {
            name: 'content-storage',
        }
    )
);
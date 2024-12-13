import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export const useMoreInfoPage = (id, contentType) => {
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState(null);
    const [similarContent, setSimilarContent] = useState([]);
    const [reviewContent, setReviewContent] = useState({ results: [] });
    const [castMember, setCastMember] = useState({ cast: [] });
    const [recommendations, setRecommendations] = useState([]);
    const [contentImages, setContentImages] = useState({ backdrops: [] });
    const [bookmarks, setBookmarks] = useState([]);
    const [filterRole, setFilterRole] = useState("Cast & Crew");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const endpoints = [
                `/api/v1/content/${contentType}/${id}/details`,
                `/api/v1/content/${contentType}/${id}/similar`,
                `/api/v1/content/${contentType}/${id}/reviews`,
                `/api/v1/content/${contentType}/${id}/credits`,
                `/api/v1/content/${contentType}/${id}/recommendations`,
                `/api/v1/content/${contentType}/${id}/images`
            ];
        
            try {
                const responses = await Promise.allSettled(endpoints.map((url) => axios.get(url)));
                responses.forEach((res, i) => {
                    if (res.status === "fulfilled") {
                        switch (i) {
                            case 0: setContent(res.value.data.content); break;
                            case 1: setSimilarContent(res.value.data.similar); break;
                            case 2: setReviewContent(res.value.data.review); break;
                            case 3: setCastMember(res.value.data.content); break;
                            case 4: setRecommendations(res.value.data.content); break;
                            case 5: setContentImages(res.value.data.content); break;
                        }
                    }
                });
            } catch (error) {
                console.error("Failed to fetch one or more resources", error);
            } finally {
                setLoading(false);
            }
        };
      
        fetchData();
    }, [contentType, id]);

    const handleBookmark = async () => {
        try {
            await axios.post('/api/v1/bookmark/add', {
                contentId: id,
                contentType: contentType,
                title: content.title || content.name,
                posterPath: content.poster_path
            });
            setBookmarks(prev => [...prev, {
                contentId: id,
                contentType,
                title: content.title || content.name,
                posterPath: content.poster_path
            }]);
            toast.success(`Added ${content.original_title || content.name} to your bookmarks list!`);
        } catch (error) {
            if (error.response?.status === 400) {
                toast.error('This item is already in your bookmarks');
            } else {
                console.error('Failed to add bookmark', error);
            }
        }
    };

    const isBookmarked = bookmarks.some(
        bookmark => 
            bookmark.contentId === id && 
            bookmark.contentType === contentType
    );

    return {
        loading,
        content,
        similarContent,
        reviewContent,
        castMember,
        recommendations,
        contentImages,
        bookmarks,
        filterRole,
        setFilterRole,
        handleBookmark,
        isBookmarked
    };
};
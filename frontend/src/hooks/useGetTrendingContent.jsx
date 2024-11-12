import { useEffect, useState } from "react";
import { useContentStore } from "../store/content";
import axios from "axios";

const useGetTrendingContent = (page = 1) => {
    const [trendingContent, setTrendingContent] = useState(null);
    const { contentType } = useContentStore();

    useEffect(() => {
        const getTrendingContent = async () => {
            const res = await axios.get(`/api/v1/content/${contentType}/trending`, {
                params: { page }  // Pass page as a query parameter
            });
            setTrendingContent(res.data.content);
        };

        getTrendingContent();
    }, [contentType, page]);

    return { trendingContent };
};

export default useGetTrendingContent;

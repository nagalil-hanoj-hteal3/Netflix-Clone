import { useEffect, useRef, useState } from "react";
import { useContentStore } from "../store/content";
import axios from "axios";
import { Link } from "react-router-dom";
import { SMALL_IMG_BASE_URL } from "../utils/constants";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

export const MovieSlider = ({category}) => {
    const { contentType } = useContentStore();
    const [ content, setContent ] = useState([]);
    // const [ showArrows, setShowArrows ] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const sliderRef = useRef(null);

    const formattedCategoryName = category.replaceAll("_", " ").toLowerCase().replace(/(^|\s)\w/g, letter => letter.toUpperCase());
    const formattedContentType = contentType === "movie" ? "Movies" : "TV Shows";

    const checkScroll = () => {
        if (sliderRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
            
            // Can scroll left if we're not at the beginning
            setCanScrollLeft(scrollLeft > 0);
            
            // Can scroll right if we haven't reached the end
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
        }
    };

    useEffect(() => {
        const getContent = async () => {
            try {
                const res = await axios.get(`/api/v1/content/${contentType}/${category}`);
                setContent(res.data.content || []);  // Set an empty array if content is undefined
            } catch (error) {
                console.error("Failed to fetch content:", error);
            }
        };
        getContent();
    }, [contentType, category]);

    useEffect(() => {
        const slider = sliderRef.current;
        if (slider) {
            // Check initially
            checkScroll();
            // Add scroll event listener
            slider.addEventListener('scroll', checkScroll);
            // Add resize event listener to window
            window.addEventListener('resize', checkScroll);

            // Cleanup
            return () => {
                slider.removeEventListener('scroll', checkScroll);
                window.removeEventListener('resize', checkScroll);
            };
        }
    }, [content]);

    const scrollLeft = () => {
        if(sliderRef.current) {
            sliderRef.current.scrollBy({left: -sliderRef.current.offsetWidth, behavior: 'smooth'})
        }
    }
    const scrollRight = () => {
        if(sliderRef.current) {
            sliderRef.current.scrollBy({left: sliderRef.current.offsetWidth, behavior: 'smooth'})
        }
    }

    return (
        <div className="relative px-4 py-6 group">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent mb-8">
                {formattedCategoryName} {formattedContentType}
            </h2>
            
            <div 
                className="flex space-x-8 overflow-x-scroll scrollbar-hide pb-6" 
                ref={sliderRef}
            >
                {content.map((item) => (
                    <Link to={`/watch/${item.id}`} className="flex-none w-72 group/card relative" key={item.id}>
                        <div className="relative rounded-xl overflow-hidden aspect-video mb-4 shadow-lg shadow-blue-900/20 transform transition-all duration-300 group-hover/card:shadow-blue-500/30 group-hover/card:scale-105">
                            <img src={SMALL_IMG_BASE_URL + item.backdrop_path} alt={item.title || item.name} className="w-full h-full object-cover"/>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-all duration-300">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-blue-500/80 p-4 rounded-full transform scale-0 group-hover/card:scale-100 transition-transform duration-300">
                                        <Play className="w-4 h-4 text-white"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-medium text-slate-200 group-hover/card:text-blue-400 transition-colors text-center line-clamp-1">
                                {item.title || item.name}
                            </h3>
                        </div>
                    </Link>
                ))}
            </div>

            {/* <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" /> */}

            {(
                <>
                    {canScrollLeft && (
                        <button 
                            onClick={scrollLeft} 
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-blue-600/90 hover:bg-blue-500 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg hover:shadow-blue-500/50 transform hover:-translate-x-1"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                    )}
                    {canScrollRight && (
                        <button 
                            onClick={scrollRight} 
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600/90 hover:bg-blue-500 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg hover:shadow-blue-500/50 transform hover:translate-x-1"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    )}
                </>
            )}
        </div>
    );
}

export default MovieSlider;
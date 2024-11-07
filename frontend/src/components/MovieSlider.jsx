import { useEffect, useRef, useState } from "react";
import { useContentStore } from "../store/content";
import axios from "axios";
import { Link } from "react-router-dom";
import { SMALL_IMG_BASE_URL } from "../utils/constants";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const MovieSlider = ({category}) => {
    const { contentType } = useContentStore();
    const [ content, setContent ] = useState([]);
    const [ showArrows, setShowArrows ] = useState(false);

    const sliderRef = useRef(null);

    const formattedCategoryName = category.replaceAll("_", " ")[0].toUpperCase() + category.replaceAll("_", " ").slice(1);
    const formattedContentType = contentType === "movie" ? "Movies" : "TV Shows";

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
    <div className="bg-black text-white relative px-5 md:px-20" onMouseEnter={() => setShowArrows(true)} onMouseLeave={() => setShowArrows(false)}>
        <h2 className="mb-4 text-2xl font-bold">
            {formattedCategoryName} {formattedContentType}
        </h2>
        <div className="flex space-x-4 overflow-x-scroll scrollbar-hide" ref={sliderRef}>
            {/* set the list for each category in each horizontal scroll */}
            {content.map((item) => (
                <Link to={`/watch/${item.id}`} className="min-w-[250px] relative group hover:text-red-300" key={item.id}>
                    <div className="rounded-lg overflow-hidden">
                        <img src={SMALL_IMG_BASE_URL + item.backdrop_path} alt="Movie image"
                            className="transition-transform duration-300 ease-in-out group-hover:scale-125"
                        />
                    </div>
                    <p className="mt-2 text-center ">
                        {item.title || item.name}
                    </p>
                </Link>
            ))}
        </div>

        {showArrows && (
            <>
            <button onClick={scrollLeft} className="absolute top-1/2 -translate-y-1/2 left-5 md:left-24 flex items-center justify-center size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10">
                <ChevronLeft size={24}/>
            </button>
            <button onClick={scrollRight} className="absolute top-1/2 -translate-y-1/2 right-5 md:right-24 flex items-center justify-center size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10">
                <ChevronRight size={24}/>
            </button>
            </>
        )}

    </div>
    )
}

export default MovieSlider;
import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useContentStore } from "../store/content";
import axios from "axios";
import Navbar from "../components/Navbar";
import { ChevronLeft, ChevronRight, InfoIcon } from "lucide-react";
import ReactPlayer from "react-player";
import WatchPageSkeleton from "../components/skeletons/WatchPageSkeleton";

export const WatchPage = () => {
    const {id} = useParams();
    const [trailers, setTrailers] = useState([]);
    const [currentTrailerIdx, setCurrentTrailerIdx] = useState(0);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState(null);
    const {contentType} = useContentStore();
    const [currentTrailerPage, setCurrentTrailerPage] = useState(0);

    const trailerContainerRef = useRef(null);
    const trailerRefs = useRef([]);

    useEffect(() => {
        const getTrailers = async () => {
            try {
                const res = await axios.get(`/api/v1/content/${contentType}/${id}/trailers`);
                setTrailers(res.data.trailers);
            } catch (error) {
                if(error.message.includes("404")) {
                    setTrailers([]);
                }
            }            
        };
        getTrailers();
    }, [contentType, id]);

    useEffect(() => {
        const getContentDetails = async () => {
            try {
                const res = await axios.get(`/api/v1/content/${contentType}/${id}/details`);
                setContent(res.data.content);
            } catch (error) {
                if(error.message.includes("404")) {
                    setContent(null);
                }
            } finally {
                setLoading(false);
            }         
        };
        getContentDetails();
    }, [contentType, id]);

    useEffect(() => {
        // Ensure the selected trailer is in view when currentTrailerIdx changes
        if (trailerRefs.current[currentTrailerIdx]) {
            trailerRefs.current[currentTrailerIdx].scrollIntoView({
                behavior: 'smooth',
                inline: 'center',
                block: 'nearest'
            });
        }

        // Update the current trailer page based on the global trailer index
        const newPage = Math.floor(currentTrailerIdx / 3);
        setCurrentTrailerPage(newPage);
    }, [currentTrailerIdx]);

    const handleTrailerChange = (index) => {
        setCurrentTrailerIdx(index);
    }

    // Calculate trailer pages for full screen view
    const trailerPages = trailers.length > 0 
        ? Array.from({ length: Math.ceil(trailers.length / 3) }, (_, pageIndex) => 
            trailers.slice(pageIndex * 3, (pageIndex + 1) * 3)
          )
        : [];

    const handleNextTrailerPage = () => {
        if (currentTrailerPage < trailerPages.length - 1) {
            const nextPageFirstTrailerIndex = (currentTrailerPage + 1) * 3;
            setCurrentTrailerIdx(nextPageFirstTrailerIndex);
        }
    }

    const handlePrevTrailerPage = () => {
        if (currentTrailerPage > 0) {
            const prevPageFirstTrailerIndex = (currentTrailerPage - 1) * 3;
            setCurrentTrailerIdx(prevPageFirstTrailerIndex);
        }
    }

    if(loading) return (
        <div className="min-h-screen bg-slate-900">
            <Navbar />
            <div className="p-4 md:p-8">
                <WatchPageSkeleton/>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
            <Navbar/>
            
            <main className="container mx-auto px-4 py-6 max-w-7xl">
                {/* Title and Navigation Bar */}
                <div className="mb-6 flex sm:flex-row justify-between items-center gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                        {content?.title || content?.name}
                    </h1>
                    
                    <Link 
                        to={`/${contentType}/moreinfo/${id}`} 
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-200 hover:scale-105"
                    >
                        <InfoIcon className="size-4" />
                        <span className="hidden sm:inline">More Info</span>
                    </Link>
                </div>

                {/* Video and Trailer Container */}
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Main Video Player Container */}
                    <div className="flex-grow relative w-full rounded-xl overflow-hidden bg-slate-800 shadow-2xl">
                        <div className="max-w-screen-2xl mx-auto">
                            {trailers.length > 0 ? (
                                <div className="relative w-full aspect-video">
                                    <ReactPlayer
                                        controls={true}
                                        width="100%"
                                        height="100%"
                                        className="absolute top-0 left-0"
                                        url={`https://www.youtube.com/watch?v=${trailers[currentTrailerIdx].key}`}
                                    />
                                </div>
                            ) : (
                                <div className="aspect-video flex flex-col items-center justify-center p-4 sm:p-8 text-center">
                                    <img
                                        src="/404.png"
                                        alt="No trailers available"
                                        className="max-w-xs sm:max-w-md w-full h-auto rounded-lg mb-4 sm:mb-6 opacity-80"
                                    />
                                    <h2 className="text-lg sm:text-xl text-slate-300">
                                        Sorry, we currently do not have trailers for{" "}
                                        <span className="font-semibold text-blue-400">
                                            {content?.title || content?.name}
                                        </span>
                                    </h2>
                                    <p className="text-sm sm:text-base text-slate-400 mt-2">
                                        Check back later or view more information about this title.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Trailer Thumbnails */}
                    {trailers.length > 0 && (
                        <div className="w-full lg:w-64 xl:w-80">
                            {/* Mobile View - Horizontal Scroll */}
                            <div className="lg:hidden relative">
                                <div ref={trailerContainerRef} className="flex gap-2 overflow-x-auto scrollbar-hide mt-5 scroll-smooth">
                                    {trailers.map((trailer, index) => (
                                        <div 
                                            key={trailer.key}
                                            ref={el => trailerRefs.current[index] = el}
                                            onClick={() => handleTrailerChange(index)}
                                            className={`
                                                cursor-pointer relative w-1/4 aspect-video shrink-0
                                                ${index === currentTrailerIdx ? 'border-2 border-blue-500' : 'border-2 border-transparent'}
                                                hover:opacity-80 transition-all duration-200
                                            `}
                                        >
                                            <img 
                                                src={`https://img.youtube.com/vi/${trailer.key}/mqdefault.jpg`}
                                                alt={`Trailer ${index + 1}`}
                                                className="absolute inset-0 w-full h-full object-cover rounded-lg"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Mobile Pagination Controls */}
                                {trailers.length > 4 && (
                                    <div className="flex justify-center items-center mt-10 gap-4">
                                        <button 
                                            onClick={() => {
                                                if (currentTrailerIdx > 0) {
                                                    const newIndex = Math.max(0, currentTrailerIdx - 1);
                                                    handleTrailerChange(newIndex);
                                                }
                                            }}
                                            disabled={currentTrailerIdx === 0}
                                            className={`
                                                bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-full 
                                                transition-all duration-200 
                                                ${currentTrailerIdx === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                                            `}
                                        >
                                            <ChevronLeft className="size-5" />
                                        </button>
                                        <span className="text-slate-400 text-sm">
                                            {currentTrailerIdx + 1} of {trailers.length}
                                        </span>
                                        <button 
                                            onClick={() => {
                                                const newIndex = Math.min(trailers.length - 1, currentTrailerIdx + 1);
                                                handleTrailerChange(newIndex);
                                            }}
                                            disabled={currentTrailerIdx === trailers.length - 1}
                                            className={`
                                                bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-full 
                                                transition-all duration-200 
                                                ${currentTrailerIdx === trailers.length - 1 
                                                    ? 'opacity-50 cursor-not-allowed' 
                                                    : 'hover:scale-105'}
                                            `}
                                        >
                                            <ChevronRight className="size-5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                            {/* Desktop View - 3 Trailers with Pagination */}
                            <div className="hidden lg:block">
                                <div className="grid grid-cols-1 gap-2">
                                    {trailerPages[currentTrailerPage]?.map((trailer, index) => (
                                        <div 
                                            key={trailer.key}
                                            onClick={() => {
                                                const globalIndex = currentTrailerPage * 3 + index;
                                                handleTrailerChange(globalIndex);
                                            }}
                                            className={`
                                                cursor-pointer relative w-full aspect-video
                                                ${currentTrailerIdx === currentTrailerPage * 3 + index 
                                                    ? 'border-2 border-blue-500' 
                                                    : 'border-2 border-transparent'}
                                                hover:opacity-80 transition-all duration-200
                                            `}
                                        >
                                            <img 
                                                src={`https://img.youtube.com/vi/${trailer.key}/mqdefault.jpg`}
                                                alt={`Trailer ${index + 1}`}
                                                className="absolute inset-0 w-full h-full object-cover rounded-lg"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination Controls */}
                                {trailerPages.length > 1 && (
                                    <div className="flex justify-center items-center mt-2 gap-4">
                                        <button 
                                            onClick={handlePrevTrailerPage}
                                            disabled={currentTrailerPage === 0}
                                            className={`
                                                bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-full 
                                                transition-all duration-200 
                                                ${currentTrailerPage === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                                            `}
                                        >
                                            <ChevronLeft className="size-5" />
                                        </button>
                                        <span className="text-slate-400 text-sm">
                                            Page {currentTrailerPage + 1} of {trailerPages.length}
                                        </span>
                                        <button 
                                            onClick={handleNextTrailerPage}
                                            disabled={currentTrailerPage === trailerPages.length - 1}
                                            className={`
                                                bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-full 
                                                transition-all duration-200 
                                                ${currentTrailerPage === trailerPages.length - 1 
                                                    ? 'opacity-50 cursor-not-allowed' 
                                                    : 'hover:scale-105'}
                                            `}
                                        >
                                            <ChevronRight className="size-5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default WatchPage;
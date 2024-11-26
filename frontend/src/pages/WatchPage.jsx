import { useEffect, useState } from "react";
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

    const handleNext = () => {
        if(currentTrailerIdx < trailers.length - 1)
            setCurrentTrailerIdx(currentTrailerIdx + 1);
    }

    const handlePrev = () => {
        if(currentTrailerIdx > 0)
            setCurrentTrailerIdx(currentTrailerIdx - 1);
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
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                        {content?.title || content?.name}
                    </h1>
                    
                    <div className="flex items-center gap-2">
                        {trailers.length > 0 && (
                            <div className="flex items-center gap-2">
                                <button 
                                    className={`bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-full transition-all duration-200 ${currentTrailerIdx === 0 ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`} 
                                    onClick={handlePrev} 
                                    disabled={currentTrailerIdx === 0}
                                >
                                    <ChevronLeft className="size-5" />
                                </button>

                                <span className="text-slate-400 text-sm">
                                    {currentTrailerIdx + 1} / {trailers.length}
                                </span>

                                <button 
                                    className={`bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-full transition-all duration-200 ${currentTrailerIdx === trailers.length - 1 ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`} 
                                    onClick={handleNext} 
                                    disabled={currentTrailerIdx === trailers.length - 1}
                                >
                                    <ChevronRight className="size-5" />
                                </button>
                            </div>
                        )}

                        <Link 
                            to={`/${contentType}/moreinfo/${id}`} 
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-200 hover:scale-105"
                        >
                            <InfoIcon className="size-4" />
                            <span className="hidden sm:inline">More Info</span>
                        </Link>
                    </div>
                </div>

                {/* Video Player Container */}
                <div className="relative w-full rounded-xl overflow-hidden bg-slate-800 shadow-2xl">
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
            </main>
        </div>
    );
};

export default WatchPage;
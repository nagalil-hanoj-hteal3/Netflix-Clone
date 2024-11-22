import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useContentStore } from "../store/content";
import axios from "axios";
import Navbar from "../components/Navbar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReactPlayer from "react-player";
import WatchPageSkeleton from "../components/skeletons/WatchPageSkeleton";

export const WatchPage = () => {
    const {id} = useParams();
    // console.log(id);
    const [trailers, setTrailers] = useState([]);
    const [currentTrailerIdx, setCurrentTrailerIdx] = useState(0);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState(null);
    const {contentType} = useContentStore();

    // trailers of the movie or tv show
    useEffect(() => {
        const getTrailers = async () => {
            try {
                const res = await axios.get(`/api/v1/content/${contentType}/${id}/trailers`);
                // console.log("Full content response:", res.data.content);
                setTrailers(res.data.trailers);
            } catch (error) {
                if(error.message.includes("404")) {
                    console.log("No trailers found...empty");
                    setTrailers([]);
                }
            }            
        };
        getTrailers();
    }, [contentType, id]);

    // details of the movie or tv show
    useEffect(() => {
        const getContentDetails = async () => {
            try {
                const res = await axios.get(`/api/v1/content/${contentType}/${id}/details`);
                setContent(res.data.content);
            } catch (error) {
                if(error.message.includes("404")) {
                    // console.log("No trailers found...empty");
                    setContent(null);
                }
            }  finally {
                setLoading(false);
            }         
        };
        getContentDetails();
    }, [contentType, id]);

    const handleNext = () => {
        if(currentTrailerIdx < trailers.length - 1)
            setCurrentTrailerIdx(currentTrailerIdx +1);
    }

    const handlePrev = () => {
        if(currentTrailerIdx > 0)
            setCurrentTrailerIdx(currentTrailerIdx -1);
    }

    if(loading) return (
        <div className="min-h-screen bg-black p-10">
            <WatchPageSkeleton/>
        </div>
    )

    return (
        // <Navbar/>
        <div className="bg-black min-h-screen text-white">
            <div className="mx-auto container px-4 py-8 h-full">
                <Navbar/>

                {trailers.length > 0 ? (
                <div className="flex justify-between items-center mb-4">
                    <button 
                        className={`bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded ${currentTrailerIdx === 0 ? "cursor-not-allowed opacity-50" : ""}`} 
                        onClick={handlePrev} 
                        disabled={currentTrailerIdx === 0}>
                        <ChevronLeft size={24} />
                    </button>

                    {/* Always show the More Info link */}
                    <Link to={`/${contentType}/moreinfo/${id}`} className="bg-gray-500/70 text-white rounded py-2 px-2 hover:bg-gray-500">
                        More Info About: {content.title || content.name}
                    </Link>

                    <button 
                        className={`bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded ${currentTrailerIdx === trailers.length - 1 ? "cursor-not-allowed opacity-50" : ""}`} 
                        onClick={handleNext} 
                        disabled={currentTrailerIdx === trailers.length - 1}>
                        <ChevronRight size={24} />
                    </button>
                </div>
                ) : (
                    // If there are no trailers, show the More Info link only
                    <div className="flex justify-center items-center mb-4">
                        <Link to={`/${contentType}/moreinfo/${id}`} className="bg-gray-500/70 text-white rounded py-2 px-2 hover:bg-gray-500">
                            More Info About: {content.title || content.name}
                        </Link>
                    </div>
                )}
                
                {/* video display */}
                <div className="aspect-video p-2 sm:px-10 md:px-32">
                    
                    {/* display trailers about the movie/tv show */}
                    {trailers.length > 0 ? (
                        <ReactPlayer
                            controls={true}
                            width={"100%"}
                            height={"70vh"}
                            className="mx-auto overflow-hidden rounded-lg"
                            url={`https://www.youtube.com/watch?v=${trailers[currentTrailerIdx].key}`}
                        />
                    ) : (
                        <div className="text-center mt-5">
                            <img
                                src="/404.png"  // Path to your fallback image
                                alt="No trailers available"
                                className="mx-auto max-w-full h-auto rounded-lg"
                            />
                            <h2 className="text-xl mt-3">
                                Sorry, we currently do not have trailers of{" "}
                                <span className="font-bold text-red-600">
                                    {content?.title || content?.name}
                                </span> at this time 😥
                            </h2>
                        </div>
                    )}

                </div>

                {/* <div className="text-right lg:mr-8 ">
                    Page: {currentTrailerIdx + 1}
                </div> */}
            </div>
        </div>
    )
}

export default WatchPage;
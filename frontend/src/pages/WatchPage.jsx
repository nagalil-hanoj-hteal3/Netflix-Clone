import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useContentStore } from "../store/content";
import axios from "axios";
import Navbar from "../components/Navbar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReactPlayer from "react-player";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";

function formatReleaseDate(date) {
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export const WatchPage = () => {
    const {id} = useParams();
    // console.log(id);
    const [trailers, setTrailers] = useState([]);
    const [currentTrailerIdx, setCurrentTrailerIdx] = useState(0);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState(null);
    const [similarContent, setSimilarContent] = useState([]);
    const {contentType} = useContentStore();

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

    useEffect(() => {
        const getSimilarContent = async () => {
            try {
                const res = await axios.get(`/api/v1/content/${contentType}/${id}/similar`);
                setSimilarContent(res.data.similar);
            } catch (error) {
                if(error.message.includes("404")) {
                    console.log("No trailers found...empty");
                    setSimilarContent([]);
                }
            }            
        };
        getSimilarContent();
    }, [contentType, id]);

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

    console.log("trailers: ", trailers);  // Pretty-prints trailers
    console.log("similar content: ", similarContent);  // Pretty-prints similar content
    console.log("content details: ", content);

    const handleNext = () => {
        if(currentTrailerIdx < trailers.length - 1)
            setCurrentTrailerIdx(currentTrailerIdx +1);
    }

    const handlePrev = () => {
        if(currentTrailerIdx > 0)
            setCurrentTrailerIdx(currentTrailerIdx -1);
    }

    return (
        // <Navbar/>
        <div className="bg-black min-h-screen text-white">
            <div className="mx-auto container px-4 py-8 h-full">
                <Navbar/>

                {trailers.length > 0 && (
                <div className="flex justify-between items-center mb-4">
                    <button className={
                        `bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded ${currentTrailerIdx === 0 ?
                        "cursor-not-allowed opacity-50": ""}
                        `}
                        disabled={currentTrailerIdx === 0}>
                        <ChevronLeft size={24}
                            onClick={handlePrev}
                        />
                     </button>

                     <button className={
                        `bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded ${currentTrailerIdx === trailers.length-1 ?
                        "cursor-not-allowed opacity-50": ""}
                        `}
                        disabled={currentTrailerIdx === trailers.length-1}>
                        <ChevronRight size={24}
                            onClick={handleNext}
                        />
                     </button>
                </div>)}
                
                {/* video display */}
                <div className="aspect-video mb-8 p-2 sm:px-10 md:px-32">
                    
                    {/* display trailers about the movie/tv show */}
                    {trailers.length > 0 && (
                        <ReactPlayer
                            controls={true} width={"100%"} height={"70vh"}
                            className="mx-auto overflow-hidden rounded-lg"
                            url={`https://www.youtube.com/watch?v=${trailers[currentTrailerIdx].key}`}
                        />
                    )}

                    {trailers?.length === 0 && (
                        <h2 className="text-xl text-center mt-5">
                            Sorry we currently do not have{" "}
                            <span className="font-bold text-red-600">
                                {content?.title || content?.name}
                            </span> at this time 😥
                        </h2>
                    )}
                </div>

                {/* movie details */}

                <div className="flex flex-col md:flex-row items-center justify-between gap-20 max-w-6xl mx-auto">
                    <div className="mb-4 md:mb-0">
                        <h2 className="text-5xl font-bold text-balance">{content?.title || content?.name}</h2>
                        <p className="mt-2 text-lg">Released:{" "}
                            {formatReleaseDate(content?.release_date || content?.first_air_date)} |{" "}
                            {content?.adult ? (
                                <span className="text-red-600">18+</span>
                            ) : (
                                <span className="text-green-600">PG-13</span>
                            )}{" "}
                        </p>
                        <p className="mt-4 text-lg">{content?.overview}</p>
                    </div>
                    <img src={ORIGINAL_IMG_BASE_URL + content.poster_path} alt="Poster image"
                    className="max-h-[600px] rounded"/>
                </div>

            </div>
        </div>
    )
}

export default WatchPage;
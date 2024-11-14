import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useContentStore } from "../store/content";
import axios from "axios";
import Navbar from "../components/Navbar";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { ORIGINAL_IMG_BASE_URL, SMALL_IMG_BASE_URL } from "../utils/constants";
import { formatReleaseDate } from "../utils/dateFunction";
import WatchPageSkeleton from "../components/skeletons/WatchPageSkeleton";

export const MoreInfoPage = () => {

    const {id} = useParams();
    // console.log(id);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState(null);
    const [similarContent, setSimilarContent] = useState([]);
    const {contentType} = useContentStore();
    const sliderRef = useRef(null);

    // added
    const [reviewContent, setReviewContent] = useState({ results: []});
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
    const [castMember, setCastMember] = useState({ cast: []});

    const castSliderRef = useRef(null);
    const similarSliderRef = useRef(null);

    const score = content?.vote_average || 0;
    const starRating = score / 2;

    const review = reviewContent?.results?.[currentReviewIndex];
    const rating = review?.author_details?.rating || 0;
    const reviewStarRating = rating / 2;

    // similar of the movie or tv show
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

    // work in progress for the review portion
    useEffect(() => {
        const getContentReview = async () => {
            try {
                const res = await axios.get(`/api/v1/content/${contentType}/${id}/reviews`);
                // console.log("review: ", res.data.review);
                setReviewContent(res.data.review);
            } catch (error) {
                if (error.message.includes("404")) {
                    setReviewContent({results: []});
                }
            }
        };

        getContentReview();
    }, [contentType, id]);

    useEffect(() => {
        const getCastDetails = async () => {
            try {
                const res = await axios.get(`/api/v1/content/${contentType}/${id}/credits`);
                // console.log("cast: ", res.data.content);
                setCastMember(res.data.content);
            } catch (error) {
                if (error.message.includes("404")) {
                    setCastMember({cast: []});
                }
            }
        };

        getCastDetails();
    }, [contentType, id]);

    const scrollLeft = (ref) => {
        if (ref.current) ref.current.scrollBy({ left: -ref.current.offsetWidth, behavior: "smooth" });
    };

    const scrollRight = (ref) => {
        if (ref.current) ref.current.scrollBy({ left: ref.current.offsetWidth, behavior: "smooth" });
    };

    if(loading) return (
        <div className="min-h-screen bg-black p-10">
            <WatchPageSkeleton/>
        </div>
    )

    // added
    const toggleContent = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const goToNextReview = () => {
        if(currentReviewIndex < reviewContent.total_results - 1)
            setCurrentReviewIndex(currentReviewIndex + 1);
        else
            setCurrentReviewIndex(0);
    };

    const goToPrevReview = () => {
        if (currentReviewIndex > 0)
            setCurrentReviewIndex(currentReviewIndex -1);
        else
            setCurrentReviewIndex(reviewContent.total_results - 1);
    };

    return (
        <div className="bg-black min-h-screen text-white">
            <div className="mx-auto container px-4 py-2 h-full">
                <Navbar/>
                {/* movie details */}

                <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 max-w-6xl mx-auto">
                {/* Left Section: Content Details */}
                    <div className="mb-4 md:mb-0 w-full md:w-1/2 ">
                        <h2 className="text-5xl font-bold text-balance mt-16">{content?.title || content?.name}</h2>
                        <p className="mt-2 text-lg">Released:{" "}
                        {formatReleaseDate(content?.release_date || content?.first_air_date)} |{" "}
                        {content?.adult ? (
                            <span className="text-red-600">18+</span>
                        ) : (
                            <span className="text-green-600">PG-13</span>
                        )}{" "}
                        </p>
                        <p className="mt-4 text-lg">{content?.overview}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                            {/* Overall Score and Star Rating */}
                            <div className="flex flex-col space-y-2">
                                <p className="text-lg">Overall Score: {score.toFixed(1)} / 10</p>

                                <div className="flex space-x-2 mt-2">
                                    {[...Array(5)].map((_, index) => {
                                        const fullStars = Math.floor(starRating);
                                        const decimal = starRating - fullStars;

                                        let clipPath = "none";
                                        let shouldFill = index < fullStars;

                                        // If the star is the first one with a partial fill
                                        if (index === fullStars && decimal > 0) {
                                            shouldFill = true; // Show partial fill for this star
                                            if (decimal >= 0.1 && decimal <= 0.4) {
                                                clipPath = "inset(0 75% 0 0)"; // About 1/4 filled
                                            } else if (decimal >= 0.5 && decimal <= 0.6) {
                                                clipPath = "inset(0 50% 0 0)"; // About half filled
                                            } else if (decimal >= 0.7 && decimal <= 0.9) {
                                                clipPath = "inset(0 25% 0 0)"; // About 3/4 filled
                                            }
                                        }

                                        return (
                                            <div key={index} className="relative w-6 h-6">
                                                {/* Gray background star */}
                                                <Star color="gray" fill="gray" className="absolute inset-0" />

                                                {/* Yellow foreground star with dynamic clipPath */}
                                                {shouldFill && (
                                                    <Star
                                                        color="yellow"
                                                        fill="yellow"
                                                        className="absolute inset-0"
                                                        style={{ clipPath }}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Watch Trailer Button */}
                            <div className="flex flex-col justify-center items-center md:items-start">
                                <Link to={`/watch/${id}`} className="bg-gray-500/70 text-white rounded py-2 px-2 hover:bg-gray-500">
                                    Watch Trailer HERE!
                                </Link>
                            </div>
                        </div>


                        {/* Cast */}
                        {castMember.cast.length > 0 && (
                        <div className="mt-12 max-w-full mx-auto relative group">
                            <h3 className="text-4xl font-bold mb-4">Cast</h3>
                            <div className="flex overflow-x-scroll gap-4 pb-4 scrollbar-hide" ref={castSliderRef}>
                            {castMember.cast.map((actor) => (
                                <Link to={{pathname: "/actor/" + actor.id}} key={actor.id} className="w-32 flex-none hover:text-rose-300">
                                <img src={actor.profile_path ? ORIGINAL_IMG_BASE_URL + actor.profile_path : "/unavailable.jpg"}
                                    alt={actor.name}
                                    className="w-full h-auto rounded-lg transition-transform duration-300 ease-in-out hover:scale-90"
                                />
                                <h4 className="mt-2 text-lg font-semibold text-center">{actor.name}</h4>
                                <p className="text-center text-sm">{actor.character}</p>
                                </Link>
                            ))}
                            </div>

                            {/* Chevron buttons */}
                            <ChevronRight onClick={() => scrollRight(castSliderRef)} className="absolute top-1/2 -translate-y-1/2 right-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer bg-red-600 text-white rounded-full z-20" />
                            <ChevronLeft onClick={() => scrollLeft(castSliderRef)} className="absolute top-1/2 -translate-y-1/2 left-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer bg-red-600 text-white rounded-full z-20" />
                            
                        </div>
                        )}
                    </div>

                    {/* Right Section: Poster Image */}
                    <div className="w-full md:w-1/2">
                    <img
                        src={content?.poster_path ? ORIGINAL_IMG_BASE_URL + content.poster_path : '/unavailable.jpg'}
                        alt="Poster image"
                        className="max-h-[700px] w-full object-cover rounded-md"
                        />
                        <h1 className="text-center text-xl mt-3 font-extrabold italic">{content.tagline ? `"${content.tagline}"` : null}</h1>
                    </div>
                </div>
                
                {/* similar portion */}
                {similarContent.length > 0 && (
                    <div className="mt-12 max-w-5xl mx-auto relative group">
                        <h3 className="text-4xl font-bold mb-4">
                            Similar Movies/TV show
                        </h3>

                        <div className="flex overflow-x-scroll scrollbar-hide gap-4 pb-4 group"
                        ref={similarSliderRef}>
                            {similarContent.map((content) => (
                                <Link key={content.id} to={`/watch/${content.id}`}
                                    className="w-52 flex-none hover:text-red-300">
                                    <img src={content.poster_path ? SMALL_IMG_BASE_URL + content.poster_path : "/unavailable.jpg"} // Fallback image
                                        alt="Similar Poster path"
                                        className="w-full h-auto transition-transform duration-300 ease-in-out hover:scale-105"/>
                                    <h4 className="mt-2 text-lg font-semibold">
                                        {content.title || content.name}
                                    </h4>
                                </Link>
                            ))}
                        <ChevronRight onClick={() => scrollRight(similarSliderRef)} className="absolute top-1/2 -translate-y-1/2 right-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer bg-red-600 text-white rounded-full z-20" />
                        <ChevronLeft onClick={() => scrollLeft(similarSliderRef)} className="absolute top-1/2 -translate-y-1/2 left-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer bg-red-600 text-white rounded-full z-20" />
                    
                        </div>
                    </div>
                )}

                {/*Reviews portion*/}

                <div className="mt-12 max-w-5xl mx-auto relative">
                    <h2 className="text-4xl font-bold mb-8">Reviews</h2>
                    {reviewContent.results.length === 0 ? (
                        <p className="mt-4 text-rose-200">No reviews available at this time.</p>
                    ) : (
                        <div className="flex items-center justify-between w-full">
                            {/* Left Chevron */}
                            <ChevronLeft
                                onClick={currentReviewIndex > 0 ? goToPrevReview : null}
                                className={`w-8 h-8 cursor-pointer bg-red-600 text-white rounded-full flex-shrink-0 ${currentReviewIndex === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
                            />

                            {/* Current Review */}
                            <div ref={sliderRef} className="max-w-3xl w-full">
                                {/* Avatar and Username */}
                                <div className="flex items-center justify-between w-full mb-4">
                                    <div className="flex items-center">
                                        <img
                                            src={`https://image.tmdb.org/t/p/w200/${reviewContent.results[currentReviewIndex].author_details.avatar_path}`}
                                            alt={`${reviewContent.results[currentReviewIndex].author} Avatar`}
                                            className="w-20 h-20 rounded-full mr-4"
                                        />
                                    </div>
                                    <span className="text-lg font-bold text-right">
                                        {reviewContent.results[currentReviewIndex].author_details.username}
                                    </span>
                                </div>

                                {/* Review Content */}
                                <p className="text-lg">
                                    {expandedIndex === currentReviewIndex || reviewContent.results[currentReviewIndex].content.length <= 300
                                        ? reviewContent.results[currentReviewIndex].content
                                        : `${reviewContent.results[currentReviewIndex].content.slice(0, 300)}...`}
                                    {reviewContent.results[currentReviewIndex].content.length > 300 && (
                                        <button onClick={() => toggleContent(currentReviewIndex)} className="text-white hover:text-blue-600">
                                            {expandedIndex === currentReviewIndex ? `\u00A0See less` : `\u00A0See more`}
                                        </button>
                                    )}
                                </p>

                                {/* Date and Rating */}
                                <p className="mt-4 text-rose-200 text-sm">
                                    {new Date(reviewContent.results[currentReviewIndex].created_at).toLocaleDateString()}
                                    {" | Rated: "}
                                    {reviewContent.results[currentReviewIndex].author_details.rating
                                        ? `${reviewContent.results[currentReviewIndex].author_details.rating}/10`
                                        : "N/A"
                                    }
                                </p>

                                {/* Star Rating */}
                                {reviewContent.results[currentReviewIndex].author_details.rating && (
                                    <div className="flex space-x-3 mt-2">
                                        {[...Array(5)].map((_, index) => {
                                            const fullStars = Math.floor(reviewStarRating);
                                            const decimal = reviewStarRating - fullStars;

                                            let clipPath = "none";
                                            let shouldFill = index < fullStars;

                                            if (index === fullStars && decimal > 0) {
                                                shouldFill = true;
                                                if (decimal >= 0.1 && decimal <= 0.4) {
                                                    clipPath = "inset(0 75% 0 0)";
                                                } else if (decimal >= 0.5 && decimal <= 0.6) {
                                                    clipPath = "inset(0 50% 0 0)";
                                                } else if (decimal >= 0.7 && decimal <= 0.9) {
                                                    clipPath = "inset(0 25% 0 0)";
                                                }
                                            }

                                            return (
                                                <div key={index} className="relative w-4 h-4">
                                                    <Star color="gray" fill="gray" className="absolute inset-0" />
                                                    {shouldFill && (
                                                        <Star
                                                            color="yellow"
                                                            fill="yellow"
                                                            className="absolute inset-0"
                                                            style={{ clipPath }}
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Right Chevron */}
                            <ChevronRight
                                onClick={currentReviewIndex < reviewContent.results.length - 1 ? goToNextReview : null}
                                className={`w-8 h-8 cursor-pointer bg-red-600 text-white rounded-full flex-shrink-0 ${currentReviewIndex === reviewContent.results.length - 1 ? 'cursor-not-allowed opacity-50' : ''}`}
                            />
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default MoreInfoPage;
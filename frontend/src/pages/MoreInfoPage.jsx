import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useContentStore } from "../store/content";
import axios from "axios";
import Navbar from "../components/Navbar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ORIGINAL_IMG_BASE_URL, SMALL_IMG_BASE_URL } from "../utils/constants";
import { formatReleaseDate } from "../utils/dateFunction";
import WatchPageSkeleton from "../components/skeletons/WatchPageSkeleton";
import StarRating from "../components/StarRating";

export const MoreInfoPage = () => {

    const {id} = useParams();
    // console.log(id);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState(null);
    const [similarContent, setSimilarContent] = useState([]);
    const {contentType} = useContentStore();
    const sliderRef = useRef(null);

    // console.log("test: ", content);

    // added
    const [reviewContent, setReviewContent] = useState({ results: []});
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
    const [castMember, setCastMember] = useState({ cast: []});
    const [filterRole, setFilterRole] = useState("Cast & Crew");
    const [recommendations, setRecommendations] = useState([]);

    const castSliderRef = useRef(null);
    const similarSliderRef = useRef(null);
    const recommendationsSliderRef = useRef(null);

    const score = content?.vote_average || 0;

    // console.log("crew: ", castMember);

    // combined all the following into this use effect rather than creating multiple use effects
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [details, similar, reviews, credits, recommendations] = await Promise.all([
                    axios.get(`/api/v1/content/${contentType}/${id}/details`),
                    axios.get(`/api/v1/content/${contentType}/${id}/similar`),
                    axios.get(`/api/v1/content/${contentType}/${id}/reviews`),
                    axios.get(`/api/v1/content/${contentType}/${id}/credits`),
                    axios.get(`/api/v1/content/${contentType}/${id}/recommendations`),
                ]);
    
                setContent(details.data.content);
                setSimilarContent(similar.data.similar);
                setReviewContent(reviews.data.review);
                setCastMember(credits.data.content);
                setRecommendations(recommendations.data.content);
            } catch (error) {
                return <div className="min-h-screen bg-black text-red-500">{error}</div>;
            } finally {
                setLoading(false);
            }
        };
    
        fetchAllData();
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


    const combinedMembers = [
        ...castMember?.cast?.map(member => ({ ...member, role: 'Cast' })),
        ...castMember?.crew?.map(member => ({ ...member, role: 'Crew' }))
    ];
    
    const uniqueMembersMap = new Map();
    combinedMembers.forEach(member => {
        if (!uniqueMembersMap.has(member.id)) {
            uniqueMembersMap.set(member.id, member);
        }
    });

    const uniqueMembers = Array.from(uniqueMembersMap.values());

    const handleRoleChange = (e) => {
        setFilterRole(e.target.value);
    };

    const filteredMembers = uniqueMembers?.filter((member) => {
        if (filterRole === "Cast") return member.role === "Cast";
        if (filterRole === "Crew") return member.role === "Crew";
        return true; // "Cast & Crew" shows all
    });

    return (
        <div className="bg-black min-h-screen text-white">
            <div className="mx-auto container px-4 py-2 h-full">
                <Navbar/>
                {/* movie details */}

                <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 max-w-6xl mx-auto">
                {/* Left Section: Content Details */}
                    <div className="mb-4 md:mb-0 w-full md:w-1/2 ">
                        <h2 className="text-5xl font-bold text-balance mt-16">{content?.title || content?.name}</h2>
                        <p className="mt-4 flex flex-wrap gap-2">
                            {content?.genres?.map((genre, index) => (
                                <span  key={index}
                                    className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm mb-3">
                                    {genre?.name}
                                </span>
                            ))}
                        </p>
                        <p className="mt-2 text-lg">
                            Released:{" "}
                            {formatReleaseDate(content?.release_date || content?.first_air_date)} |{" "}
                            
                            {/* Check if runtime is available and format it */}
                            {content?.runtime ? (
                                <>
                                    {Math.floor(content.runtime / 60) > 0 && (
                                        <>
                                            {Math.floor(content.runtime / 60)}{" "}
                                            {Math.floor(content.runtime / 60) === 1 ? "hr" : "hrs"}
                                        </>
                                    )}
                                    {content.runtime % 60 > 0 && (
                                        <>
                                            {Math.floor(content.runtime / 60) > 0 && ", "}
                                            {content.runtime % 60}{" "}
                                            {content.runtime % 60 === 1 ? "min" : "mins"}{" |"}
                                        </>
                                    )}
                                </>
                            ) : null}

                            {/* Adult rating */}
                            {content?.adult ? (
                                <span className="text-red-600">{" "}18+</span>
                            ) : (
                                <span className="text-green-600">{" "}PG-13</span>
                            )}
                        </p>

                        <p className="mt-4 text-lg">{content?.overview}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                            {/* Overall Score and Star Rating */}
                            <div className="flex flex-col space-y-2">
                                <p className="text-lg">
                                    Overall Score: {score !== undefined && score !== null ? `${score.toFixed(1)} / 10` : "N/A"}
                                </p>

                                {/* Render stars only if score is available */}
                                {score !== undefined && score !== null && (
                                   <StarRating rating={score/2} maxStars={5} size="w-6 h-6"/>
                                )}
                            </div>


                            {/* Watch Trailer Button */}
                            <div className="flex flex-col justify-center items-center md:items-start">
                                <Link to={`/watch/${id}`} className="bg-gray-500/70 text-white rounded py-2 px-2 hover:bg-gray-500">
                                    Watch Trailer HERE!
                                </Link>
                            </div>
                        </div>


                        {/* Cast and Crew */}
                        {combinedMembers?.length > 0 && (
                            <div className="mt-12 max-w-full mx-auto relative group">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-4xl font-bold">{filterRole}</h3>
                                    <select value={filterRole} onChange={handleRoleChange} className="bg-gray-700 text-white p-2 rounded-md">
                                        {/* Only show Cast & Crew if both exist */}
                                            {combinedMembers.some(member => member.character) && 
                                            combinedMembers.some(member => member.job) && (
                                                <option value="Cast & Crew">Cast & Crew</option>
                                            )}
                                            
                                            {/* Only show Cast if there are cast members */}
                                            {combinedMembers.some(member => member.character) && (
                                                <option value="Cast">Cast</option>
                                            )}
                                            
                                            {/* Only show Crew if there are crew members */}
                                            {combinedMembers.some(member => member.job) && (
                                                <option value="Crew">Crew</option>
                                            )}
                                    </select>
                                </div>
                                <div className="flex overflow-x-scroll gap-4 pb-4 scrollbar-hide" ref={castSliderRef}>
                                    {filteredMembers?.map((member) =>
                                        member.profile_path ? (
                                            <Link
                                                to={`/actor/${member.id}`}
                                                key={`${member.id}-${member.role}`}
                                                className="w-32 flex-none hover:text-rose-300"
                                            >
                                                <img 
                                                    loading="lazy"
                                                    src={member.profile_path ? `${ORIGINAL_IMG_BASE_URL}${member.profile_path}` : '/unavailable.jpg'}
                                                    alt={member.name}
                                                    className="w-full h-auto rounded-lg transition-transform duration-300 ease-in-out hover:scale-90"
                                                />
                                                <h4 className="mt-2 text-lg font-semibold text-center">{member.name}</h4>
                                                <p className="text-center text-sm text-gray-500 italic">{member.character || member.job}</p>
                                                {/* <p className="text-center text-xs text-gray-500 italic">{member.role}</p> */}
                                            </Link>
                                        ) : null
                                    )}
                                </div>

                                {/* Chevron buttons */}
                                <ChevronRight
                                    onClick={() => scrollRight(castSliderRef)}
                                    className="absolute top-1/2 -translate-y-1/2 right-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer bg-red-600 text-white rounded-full z-20"
                                />
                                <ChevronLeft
                                    onClick={() => scrollLeft(castSliderRef)}
                                    className="absolute top-1/2 -translate-y-1/2 left-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer bg-red-600 text-white rounded-full z-20"
                                />
                            </div>
                        )}


                    </div>

                    {/* Right Section: Poster Image */}
                    <div className="w-full md:w-1/2">
                    <img loading="lazy"
                        src={content?.poster_path ? ORIGINAL_IMG_BASE_URL + content?.poster_path : '/unavailable.jpg'}
                        alt="Poster image"
                        className="max-h-[700px] w-full object-cover rounded-md"
                        />
                        <h1 className="text-center text-xl mt-3 font-extrabold italic">{content?.tagline ? `"${content?.tagline}"` : null}</h1>
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
                            {similarContent?.map((content) => content?.poster_path ? (
                                <Link key={content?.id} to={`/watch/${content?.id}`}
                                    className="w-52 flex-none hover:text-red-300">
                                    <img loading="lazy" src={SMALL_IMG_BASE_URL + content?.poster_path} // Fallback image
                                        alt="Similar Poster path"
                                        className="w-full h-auto transition-transform duration-300 ease-in-out hover:scale-105"/>
                                    <h4 className="mt-2 text-lg font-semibold">
                                        {content?.title || content?.name}
                                    </h4>
                                </Link>
                            ) : null)}
                        <ChevronRight onClick={() => scrollRight(similarSliderRef)} className="absolute top-1/2 -translate-y-1/2 right-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer bg-red-600 text-white rounded-full z-20" />
                        <ChevronLeft onClick={() => scrollLeft(similarSliderRef)} className="absolute top-1/2 -translate-y-1/2 left-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer bg-red-600 text-white rounded-full z-20" />
                    
                        </div>
                    </div>
                )}

                {/* recommendations */}
                {recommendations.length > 0 && (
                    <div className="mt-5 max-w-5xl mx-auto relative group">
                        <h3 className="text-4xl font-bold mb-4">Recommended for You</h3>
                        <div className="flex overflow-x-scroll scrollbar-hide gap-4 pb-4 group" ref={recommendationsSliderRef}>
                            {recommendations?.map((item) =>
                                item?.poster_path ? (
                                    <Link key={item.id} to={`/watch/${item.id}`} className="w-52 flex-none hover:text-red-300">
                                        <img
                                            loading="lazy"
                                            src={`${SMALL_IMG_BASE_URL}${item.poster_path}`}
                                            alt="Recommendation Poster"
                                            className="w-full h-auto transition-transform duration-300 ease-in-out hover:scale-105"
                                        />
                                        <h4 className="mt-2 text-lg font-semibold">{item.title || item.name}</h4>
                                    </Link>
                                ) : null
                            )}
                            <ChevronRight
                                onClick={() => scrollRight(recommendationsSliderRef)}
                                className="absolute top-1/2 -translate-y-1/2 right-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer bg-red-600 text-white rounded-full z-20"
                            />
                            <ChevronLeft
                                onClick={() => scrollLeft(recommendationsSliderRef)}
                                className="absolute top-1/2 -translate-y-1/2 left-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer bg-red-600 text-white rounded-full z-20"
                            />
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
                                        <img loading="lazy"
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
                                        <StarRating
                                            rating={reviewContent.results[currentReviewIndex].author_details.rating / 2} // Convert to 5-star scale
                                            size="w-6 h-6"
                                        />
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
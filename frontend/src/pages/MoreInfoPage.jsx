import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useContentStore } from "../store/content";
import axios from "axios";
import Navbar from "../components/Navbar";
import { ChevronLeft, ChevronRight, Play, Clock, Calendar, Star, Eye, EyeOff, Award, Bookmark, User } from "lucide-react";
import { ORIGINAL_IMG_BASE_URL, SMALL_IMG_BASE_URL } from "../utils/constants";
import { formatReleaseDate } from "../utils/dateFunction";
import StarRating from "../components/StarRating";
import InfoIconWithTooltip from "../components/InfoIconWithTooltip";
import TV_Modal from "../components/TV_Modal";
import Gallery from "../components/moreinfo/Gallery";
import toast from "react-hot-toast";
import CreativeLoadingScreen from "../components/skeletons/MoreInfoLoading"; 

function MoreInfoPage() {

    const {id} = useParams();
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState(null);
    const [similarContent, setSimilarContent] = useState([]);
    const {contentType, setContentTypeFromPath} = useContentStore();

    // added
    const [reviewContent, setReviewContent] = useState({ results: []});
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
    const [castMember, setCastMember] = useState({ cast: []});
    const [filterRole, setFilterRole] = useState("Cast & Crew");
    const [recommendations, setRecommendations] = useState([]);
    const [contentImages, setContentImages] = useState({ backdrops: []});
    const [bookmarks, setBookmarks] = useState([]);

    const [canScrollStates, setCanScrollStates] = useState({
        cast: { left: false, right: false },
        similar: { left: false, right: false },
        recommendations: { left: false, right: false }
    });

    const castSliderRef = useRef(null);
    const similarSliderRef = useRef(null);
    const recommendationsSliderRef = useRef(null);
    const reviewersSliderRef = useRef(null);

    const score = content?.vote_average || 0;
    const location = window.location.pathname;

    const combinedMembers = [
        ...(castMember?.cast?.map(member => ({ ...member, role: 'Cast' })) || []),
        ...(castMember?.crew?.map(member => ({ 
            ...member, 
            role: member.job === 'Director' ? 'Director' : 'Crew' 
        })) || [])
    ];

    const hasCastMembers = combinedMembers?.some(member => member.role === "Cast" && member.profile_path);
    const hasCrewMembers = combinedMembers?.some(member => 
        (member.role === "Crew" || member.role === "Director") && 
        member.profile_path
    );
    // console.log("content: ", content);
    // console.log("similar : ", similarContent);
    // console.log("review: ", reviewContent);
    // console.log("cast member: ", castMember?.crew[0]?.name);
    // console.log("recommendations: ", recommendations);
    // console.log("test: ", contentImages);

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const response = await axios.get('/api/v1/bookmark');
                setBookmarks(response.data.bookmarks);
            } catch (error) {
                console.error('Failed to fetch bookmarks', error);
            }
        };

        fetchBookmarks();
    }, []);

    const handleBookmark = async () => {
        try {
            await axios.post('/api/v1/bookmark/add', {
                contentId: id,
                contentType: contentType,
                title: content.title || content.name,
                posterPath: content.poster_path
            });
            // Update local bookmarks state
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

    useEffect(() => {
        setContentTypeFromPath(location);
    }, [location, setContentTypeFromPath]);
    
    // Add this useEffect for scroll restoration
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        if (hasCastMembers && !hasCrewMembers) {
            setFilterRole("Cast");
        } else if (!hasCastMembers && hasCrewMembers) {
            setFilterRole("Crew");
        } else if (hasCastMembers && hasCrewMembers) {
            setFilterRole("Cast & Crew");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [castMember]);

    // combined all the following into this use effect rather than creating multiple use effects
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
            }
             finally {
                setLoading(false);
            }
        };
      
        fetchData();
    }, [contentType, id]);

    const checkScroll = (slider, section) => {
        if (slider) {
            const { scrollLeft, scrollWidth, clientWidth } = slider;
            const hasOverflow = scrollWidth > clientWidth + 1;
            
            setCanScrollStates(prev => ({
                ...prev,
                [section]: {
                    left: hasOverflow && scrollLeft > 0,
                    right: hasOverflow && scrollLeft + clientWidth < scrollWidth - 1
                }
            }));
        }
    };

    const scroll = (direction, sliderRef, section) => {
        if (sliderRef.current) {
            const scrollAmount = direction === 'left' ? -sliderRef.current.offsetWidth : sliderRef.current.offsetWidth;
            sliderRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
            
            // Check scroll possibility after animation
            setTimeout(() => checkScroll(sliderRef.current, section), 400);
        }
    };

    useEffect(() => {
        const sliders = {
            cast: castSliderRef?.current,
            similar: similarSliderRef?.current,
            recommendations: recommendationsSliderRef?.current
        };

        Object.entries(sliders).forEach(([section, slider]) => {
            if (slider) {
                // Initial check
                checkScroll(slider, section);

                // Add event listeners
                const handleScroll = () => checkScroll(slider, section);
                slider.addEventListener('scroll', handleScroll);
                window.addEventListener('resize', handleScroll);

                // Cleanup
                return () => {
                    slider.removeEventListener('scroll', handleScroll);
                    window.removeEventListener('resize', handleScroll);
                };
            }
        });
    }, [content, similarContent, recommendations]);

    useEffect(() => {
        // Reset scroll position when filter changes
        if (castSliderRef.current) {
            castSliderRef.current.scrollLeft = 0;
        }
        
        // Add small delay to allow DOM to update
        setTimeout(() => {
            checkScroll(castSliderRef.current, 'cast');
        }, 100);
    }, [filterRole]);

    useEffect(() => {
        const currentSlider = castSliderRef.current;
        
        if (currentSlider) {
            const resizeObserver = new ResizeObserver(() => {
                checkScroll(currentSlider, 'cast');
            });
            
            resizeObserver.observe(currentSlider);
            
            // Initial check
            checkScroll(currentSlider, 'cast');

            return () => {
                resizeObserver.disconnect();
            };
        }
    }, [castMember, filterRole]);

    const renderScrollButtons = (section, sliderRef) => (
        <>
            {canScrollStates[section]?.left && (
                <button
                    onClick={() => scroll('left', sliderRef, section)}
                    className="absolute left-0 top-1/3 -translate-y-1/2 p-3 
                            bg-blue-600/90 hover:bg-blue-500 backdrop-blur rounded-full 
                            transition-all duration-300 opacity-0 group-hover:opacity-100
                            shadow-lg hover:shadow-blue-500/50 transform hover:-translate-x-1"
                >
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>
            )}
            {canScrollStates[section]?.right && (
                <button
                    onClick={() => scroll('right', sliderRef, section)}
                    className="absolute right-0 top-1/3 -translate-y-1/2 p-3 
                            bg-blue-600/90 hover:bg-blue-500 backdrop-blur rounded-full 
                            transition-all duration-300 opacity-0 group-hover:opacity-100
                            shadow-lg hover:shadow-blue-500/50 transform hover:translate-x-1"
                >
                    <ChevronRight className="w-6 h-6 text-white" />
                </button>
            )}
        </>
    );

    if(loading) return (<CreativeLoadingScreen/>)

    const goToNextReview = () => {
        if(currentReviewIndex < reviewContent?.total_results - 1){
            setCurrentReviewIndex(prev => prev + 1);
            setExpandedIndex(null);
        }
    };

    const goToPrevReview = () => {
        if (currentReviewIndex > 0){
            setCurrentReviewIndex(prev => prev - 1);
            setExpandedIndex(null);
        }
    };

    // added
    const toggleContent = (index) => {
        setExpandedIndex(prevIndex => prevIndex === index ? null : index);
    };

    const uniqueMembersMap = new Map();
    combinedMembers.forEach(member => {
        const existingMember = uniqueMembersMap.get(member.id);
        if (!uniqueMembersMap.has(member.id)) {
            uniqueMembersMap.set(member.id, member);
        } else {
            // If the member already exists, update with more specific role information
            if (
                member.job === 'Director' || 
                member.role === 'Director' || 
                (existingMember.role !== 'Director' && member.role === 'Director')
            ) {
                uniqueMembersMap.set(member.id, member);
            }
        }
    });

    const uniqueMembers = Array.from(uniqueMembersMap.values());

    const handleRoleChange = (e) => {
        setFilterRole(e.target.value);
    };

    const filteredMembers = uniqueMembers?.filter((member) => {
        if (filterRole === "Cast") return member.role === "Cast";
        if (filterRole === "Crew") return member.role === "Crew" && member.job !== "Director";
        if (filterRole === "Director") { 
            const isDirector = member.role === "Director" || member.job === "Director";
            return isDirector;
        }
        return true; // "Cast & Crew" shows all
    }) || [];

    // console.log('Filtered Members:', filteredMembers);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white">
            <Navbar/>
            <div className="relative min-h-screen">
                {/* movie details */}
                {/* Backdrop Image */}
                <div className="absolute inset-0 h-[90vh]">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"/>
                    {content?.backdrop_path && (
                        <img
                            src={`${ORIGINAL_IMG_BASE_URL}${content.backdrop_path}`}
                            alt="backdrop image"
                            className="w-full h-full object-cover opacity-30"
                        />
                    )}
                </div>
                {/* Content Container */}
                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
                    <div className="flex flex-col lg:flex-row gap-8 lg:mb-28 mb-10">
                        {/* Poster */}
                        <div className="lg:w-1/4 flex-shrink-0">
                            <div className="rounded-xl overflow-hidden shadow-2xl transform hover:scale-105 transition duration-300">
                                <img
                                    loading="lazy"
                                    src={content?.poster_path ? `${ORIGINAL_IMG_BASE_URL}${content?.poster_path}` : '/unavailable.jpg'}
                                    alt={content?.title || content?.name}
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        </div>

                        {/* Movie Info */}
                        <div className="lg:w-3/4 space-y-6 flex-grow min-w-0">
                            {/* Title and Trailer Button */}
                            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                                <div className="min-w-0 flex-grow">
                                    <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 break-words pr-4 flex items-start gap-2">
                                        <span>{content?.title || content?.name}</span>
                                        <InfoIconWithTooltip content={content} />
                                    </h1>
                                    {content?.tagline && (
                                        <p className="text-base lg:text-lg text-gray-300 italic line-clamp-2">"{content.tagline}"</p>
                                    )}
                                    {uniqueMembers.some(member => member.role === "Director") && (
                                        <p className="text-sm lg:text-base text-gray-400 mt-2">
                                            Directed by: {" "}
                                            <span className="text-white font-medium">
                                                {uniqueMembers.filter(member => member.role === "Director")
                                                    .map(director => director.name)
                                                    .join(", ")}
                                            </span>
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-row items-center justify-start gap-2">
                                    <Link 
                                        to={`/watch/${id}`}
                                        className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white 
                                                rounded-full font-medium transition-all duration-200 shadow-lg hover:scale-105
                                                whitespace-nowrap flex-shrink-0"
                                    >
                                        <Play className="size-5 mr-2"/>
                                        Watch Trailer
                                    </Link>
                                    { !isBookmarked && (
                                        <button 
                                            onClick={handleBookmark}
                                            className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                                        >
                                            <Bookmark className="size-6" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Genres */}
                            <div className="flex flex-wrap gap-2">
                                {content?.genres?.map((genre) => (
                                    <span
                                        key={genre.id}
                                        className="px-3 py-1 bg-gray-800/80 text-gray-200 rounded-full text-sm
                                                backdrop-blur-sm border border-gray-700 flex items-center"
                                    >
                                        <Award className="size-3 mr-1.5 text-blue-400"/>
                                        {genre.name}
                                    </span>
                                ))}
                            </div>

                            {/* Metrics */}
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-gray-300">
                                {score !== undefined && score !== null && (
                                    <div className="flex items-center gap-2">
                                        <div className="px-3 py-1 bg-blue-500/20 rounded-lg text-blue-400 font-semibold flex items-center">
                                            <Star className="size-4 mr-1.5"/>
                                            {score.toFixed(1)}/10
                                        </div>
                                        <StarRating rating={score/2} maxStars={5} size="w-5 h-5" />
                                    </div>
                                )}
                                <span className="flex items-center"><Calendar className="size-4 mr-1.5 text-gray-400"/>{formatReleaseDate(content?.release_date || content?.first_air_date)}</span>
                                    {content?.runtime && (
                                        <span className="flex items-center">
                                            <Clock className="size-4 mr-1.5 text-gray-400"/>
                                            {Math.floor(content.runtime / 60)}h {content.runtime % 60}m</span>
                                    )}
                                <span className={`font-medium flex items-center gap-1.5 ${content?.adult ? "text-red-500" : "text-green-500"}`}>
                                    {content?.adult ? (
                                        <EyeOff className="size-4" /> ) :
                                    (
                                        <Eye className="size-4"/>
                                    )}
                                    
                                    {content?.adult ? "18+" : "PG-13"}
                                </span>
                            </div>

                            {/* Overview */}
                            <p className="text-base lg:text-lg leading-relaxed text-gray-300">
                                {content?.overview}
                            </p>

                            {/* TV Show Episodes Modal */}
                            {contentType === "tv" && (
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                                    <TV_Modal content={content} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Cast & Crew Section */}
                    {(combinedMembers?.length > 0) && (hasCastMembers || hasCrewMembers) && (
                        <div className="mb-12">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-bold text-white">{filterRole}</h2>
                                <select 
                                    value={filterRole} 
                                    onChange={handleRoleChange}
                                    className="px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-700
                                            hover:bg-slate-700 focus:ring-2 focus:ring-blue-400 focus:outline-none
                                            transition-colors duration-200"
                                >
                                    {hasCastMembers && hasCrewMembers && (
                                        <option value="Cast & Crew">Cast & Crew</option>
                                    )}
                                    {hasCastMembers && (
                                        <option value="Cast">Cast</option>
                                    )}
                                    {hasCrewMembers && (
                                        <option value="Crew">Crew</option>
                                    )}
                                    {combinedMembers.some(member => member.job === 'Director') && (
                                        <option value="Director">Director</option>
                                    )}
                                </select>
                            </div>

                            <div className="relative group">
                                <div ref={castSliderRef} className="flex gap-6 overflow-x-scroll scrollbar-hide pb-6">
                                    {filteredMembers?.map((member) => (
                                        <Link
                                            to={`/actor/${member.id}`}
                                            key={`${member.id}-${member.role}`}
                                            className="flex-none w-36 group/card"
                                        >
                                            <div className="rounded-xl overflow-hidden bg-gray-800 shadow-lg 
                                                        transform transition duration-300 hover:scale-105">
                                                {member.profile_path ? (
                                                    <img
                                                        loading="lazy"
                                                        src={`${ORIGINAL_IMG_BASE_URL}${member.profile_path}`}
                                                        alt={member.name}
                                                        className="w-full aspect-[2/3] object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full aspect-[2/3] bg-gray-700 flex items-center justify-center">
                                                        <User className="w-12 h-12 text-gray-400" />
                                                    </div>
                                                )}
                                            <div className="p-3">
                                                <h3 className="font-medium text-white truncate">{member.name}</h3>
                                                <p className="text-sm text-gray-400 truncate">
                                                {member.character || member.job || "Role Unspecified"}
                                                </p>
                                            </div>
                                            </div>
                                        </Link>
                                        
                                    ))}
                                </div>
                                {canScrollStates.cast?.left && (
                                    <button
                                        onClick={() => scroll('left', castSliderRef, 'cast')}
                                        className="absolute left-0 top-1/2 -translate-y-1/2 p-3 z-10
                                                bg-blue-600/90 hover:bg-blue-500 backdrop-blur rounded-full 
                                                transition-all duration-300 opacity-0 group-hover:opacity-100
                                                shadow-lg hover:shadow-blue-500/50 transform hover:-translate-x-1"
                                        aria-label="Scroll left"
                                    >
                                        <ChevronLeft className="w-6 h-6 text-white" />
                                    </button>
                                )}
                                {canScrollStates.cast?.right && (
                                    <button
                                        onClick={() => scroll('right', castSliderRef, 'cast')}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 p-3 z-10
                                                bg-blue-600/90 hover:bg-blue-500 backdrop-blur rounded-full 
                                                transition-all duration-300 opacity-0 group-hover:opacity-100
                                                shadow-lg hover:shadow-blue-500/50 transform hover:translate-x-1"
                                        aria-label="Scroll right"
                                    >
                                        <ChevronRight className="w-6 h-6 text-white" />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* similar portion */}
                    {similarContent?.length > 0 && (
                        <div className="mb-12">
                            <h3 className="text-3xl font-bold mb-6">Similar {contentType === "tv" ? contentType.charAt(0).toUpperCase() + contentType.charAt(1).toUpperCase() + contentType.slice(2) : contentType.charAt(0).toUpperCase() + contentType.slice(1)}</h3>
                            <div className="relative group">
                                <div className="flex overflow-x-scroll scrollbar-hide gap-4 pb-4" ref={similarSliderRef}>
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
                                    {renderScrollButtons('similar', similarSliderRef)}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* recommendations */}

                    {recommendations?.length > 0 && (
                        <div className="mb-12">
                            <h3 className="text-3xl font-bold mb-6">Recommended for You</h3>
                            <div className="relative group">
                                <div className="flex overflow-x-scroll scrollbar-hide gap-4 pb-4" 
                                    ref={recommendationsSliderRef}>
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
                                </div>
                                {renderScrollButtons('recommendations', recommendationsSliderRef)}
                            </div>
                        </div>
                    )}

                    {/*Reviews portion*/}

                    <div className="mb-12">
                        <h2 className="text-3xl font-bold mb-6">Reviews</h2>
                        {reviewContent?.results.length === 0 ? (
                            <p className="text-white italic">No reviews available at this time.</p>
                        ) : (
                            <div className="bg-slate-800/50 rounded-xl p-6">
                                <div className="flex items-center justify-between w-full">
                                    {/* Left Chevron */}
                                    <div className={`w-12 flex-shrink-0 ${currentReviewIndex === 0 ? 'invisible' : 'visible'}`}>
                                        <button
                                            onClick={goToPrevReview}
                                            className={`p-2 bg-black/50 rounded-full transition-all duration-300 transform hover:scale-110`}
                                            disabled={currentReviewIndex === 0}
                                        >
                                            <ChevronLeft className="w-6 h-6 text-white" />
                                        </button>
                                    </div>
                                    {/* Current Review */}
                                    <div ref={reviewersSliderRef} className="flex-1 mx-4 min-h-[50vh">
                                        {/* Avatar and Username */} 
                                        <div className="flex items-center justify-between w-full mb-4">
                                            <div className="flex items-center">
                                                {reviewContent?.results[currentReviewIndex].author_details.avatar_path ? (
                                                    <img
                                                        loading="lazy"
                                                        src={`https://image.tmdb.org/t/p/w200/${reviewContent?.results[currentReviewIndex].author_details.avatar_path}`}
                                                        alt={`${reviewContent?.results[currentReviewIndex].author} Avatar`}
                                                        className="w-20 h-20 rounded-full mr-4"
                                                    />
                                                ) : (
                                                    <div 
                                                        className="w-20 h-20 rounded-full mr-4 bg-gray-700 flex items-center justify-center"
                                                    >
                                                        <User className="w-10 h-10 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-lg font-bold text-right">
                                                {reviewContent?.results[currentReviewIndex].author_details.username}
                                            </span>
                                        </div>

                                        {/* Review Content */}
                                        <p className="text-lg">
                                            {expandedIndex === currentReviewIndex || reviewContent?.results[currentReviewIndex].content.length <= 300
                                                ? reviewContent?.results[currentReviewIndex].content
                                                : `${reviewContent?.results[currentReviewIndex].content.slice(0, 300)}...`}
                                            {reviewContent?.results[currentReviewIndex].content.length > 300 && (
                                                <button onClick={() => toggleContent(currentReviewIndex)} className="text-white hover:text-blue-600">
                                                    {expandedIndex === currentReviewIndex ? `\u00A0See less` : `\u00A0See more`}
                                                </button>
                                            )}
                                        </p>

                                        {/* Date, Rating, and Review Counter */}
                                        <div className="mt-4 flex items-center justify-between">
                                            <p className="text-blue-200 text-sm">
                                                {new Date(reviewContent?.results[currentReviewIndex]?.created_at).toLocaleDateString()}
                                                {" | Rated: "}
                                                {reviewContent?.results[currentReviewIndex]?.author_details.rating
                                                    ? `${reviewContent?.results[currentReviewIndex]?.author_details.rating}/10`
                                                    : "N/A"
                                                }
                                            </p>
                                            
                                            {/* Review Counter */}
                                            <span className="text-sm font-medium bg-blue-900/50 text-blue-200 px-3 py-1 rounded-full">
                                                {currentReviewIndex + 1}/{reviewContent?.results.length}
                                            </span>
                                        </div>

                                        {/* Star Rating */}
                                        {reviewContent?.results[currentReviewIndex].author_details.rating && (
                                            <div className="flex space-x-3 mt-2">
                                                <StarRating
                                                    rating={reviewContent?.results[currentReviewIndex].author_details.rating / 2}
                                                    maxStars={5}
                                                    size="w-6 h-6"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Chevron */}
                                    <div className={`w-12 flex-shrink-0 ${currentReviewIndex === reviewContent?.results.length - 1 ? 'invisible' : 'visible'}`}>
                                        <button
                                            onClick={goToNextReview}
                                            className={`p-2 bg-black/50 rounded-full transition-all duration-300 transform hover:scale-110`}
                                            disabled={currentReviewIndex === reviewContent?.results.length - 1}
                                        >
                                            <ChevronRight className="w-6 h-6 text-white" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* gallery section */}
                    <Gallery contentImages={contentImages} ORIGINAL_IMG_BASE_URL={ORIGINAL_IMG_BASE_URL}/>
                </div>
            </div>
        </div>
    )
}

export default MoreInfoPage;
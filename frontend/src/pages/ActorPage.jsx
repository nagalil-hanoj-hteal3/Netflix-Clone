import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import WatchPageSkeleton from "../components/skeletons/WatchPageSkeleton";
import Navbar from "../components/Navbar";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import { ChevronLeft, ChevronRight, X, Calendar, MapPin, User, Link as LinkIcon, Star, Film, Tv, Camera, ExternalLink } from "lucide-react";
import { useContentStore } from "../store/content";

const calculateAge = (birthday, deathday) => {
    const birthDate = new Date(birthday);
    const endDate = deathday ? new Date(deathday) : new Date();
    let age = endDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = endDate.getMonth() - birthDate.getMonth();
    const dayDiff = endDate.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age;
};

const Modal = ({ isOpen, onClose, title, content }) => {
    if (!isOpen) return null;

    const modalContent = Array.isArray(content) ? content : [content];
    const isSingleImage = modalContent.length === 1;
    const isMovieModal = title.includes("Movies");
    const isTVModal = title.includes("TV Shows");

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
            <div className={`
                ${isSingleImage 
                    ? 'w-full h-full max-w-full max-h-full p-4' 
                    : 'bg-gray-800 p-6 rounded-lg w-full max-w-4xl md:max-w-3xl sm:max-w-xl'}
                text-white relative flex flex-col
            `}>
                {!isSingleImage && (
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">{title}</h2>
                        <button 
                            onClick={onClose} 
                            className="text-white hover:text-gray-300"
                        >
                            <X size={24} />
                        </button>
                    </div>
                )}

                {isSingleImage && (
                    <button 
                        onClick={onClose} 
                        className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
                    >
                        <X size={32} />
                    </button>
                )}

                <div className={`
                    ${isSingleImage 
                        ? 'w-full h-full flex items-center justify-center' 
                        : 'grid grid-cols-2 sm:grid-cols-3 gap-4 overflow-y-auto'}
                    overflow-y-auto max-h-[100vh]
                `}>
                    {modalContent.map((item, idx) => (
                        <div 
                            key={idx} 
                            className={`
                                ${isSingleImage 
                                    ? 'w-full h-full flex items-center justify-center' 
                                    : 'flex flex-col items-center relative group transform transition-all duration-500 hover:scale-90'}
                            `}
                        >
                            {(isMovieModal || isTVModal) ? (
                                <Link
                                    to={`/${isMovieModal ? 'movie' : 'tv'}/moreinfo/${item.id}`}
                                    onClick={() => 
                                        useContentStore.getState().setContentType(isMovieModal ? 'movie' : 'tv')
                                    }
                                    className="w-full h-full"
                                >
                                    <img
                                        src={`${ORIGINAL_IMG_BASE_URL}${item.poster_path || item.file_path}`}
                                        alt={item.title || item.name || `Image ${idx + 1}`}
                                        className={'w-full h-full object-cover rounded-lg'}
                                    />
                                </Link>
                            ) : (
                                <img
                                    src={`${ORIGINAL_IMG_BASE_URL}${item.poster_path || item.file_path}`}
                                    alt={item.title || item.name || `Image ${idx + 1}`}
                                    className={`
                                        ${isSingleImage 
                                            ? 'max-w-full max-h-full object-contain' 
                                            : 'w-full h-full object-cover rounded-lg'}
                                    `}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const ActorPage = () => {
    const { id } = useParams();
    const [actorDetails, setActorDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showBio, setShowBio] = useState(false);

    const [actorImages, setActorImages] = useState([]);
    const [actorMovies, setActorMovies] = useState([]);
    const [actorTVs, setActorTVs] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState([]);
    const [modalTitle, setModalTitle] = useState("");

    console.log("test: ", actorDetails);

    const [scrollPositions, setScrollPositions] = useState({
        movies: { isAtStart: true, isAtEnd: false },
        tvShows: { isAtStart: true, isAtEnd: false },
        gallery: { isAtStart: true, isAtEnd: false }
    });

    const checkScrollPosition = (element, section) => {
        if (element) {
            const isAtStart = element.scrollLeft === 0;
            const isAtEnd = Math.abs(
                element.scrollWidth - element.clientWidth - element.scrollLeft
            ) < 1;

            setScrollPositions(prev => ({
                ...prev,
                [section]: { isAtStart, isAtEnd }
            }));
        }
    };

    const movieScrollRef = useRef();
    const tvScrollRef = useRef();
    const imageScrollRef = useRef();

    const fetchActorDetails = async () => {
        try {
            const response = await axios.get(`/api/v1/actor/${id}`);
            setActorDetails(response.data.content);
        } catch (error) {
            toast.error(error.response.status === 404
                ? "Nothing found, make sure you are searching under the right category"
                : "An error occurred, please try again later");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActorDetails();

        const fetchActorImages = async () => {
            try {
                const response = await axios.get(`/api/v1/actor/${id}/images`);
                setActorImages(response.data.content.profiles || []);
            } catch {
                toast.error("Error fetching images...");
            }
        };

        const fetchActorMovies = async () => {
            try {
                const response = await axios.get(`/api/v1/actor/${id}/movies`);
                setActorMovies(response.data.content.cast || []);
            } catch {
                toast.error("Error fetching movies...");
            }
        };

        const fetchActorTVs = async () => {
            try {
                const response = await axios.get(`/api/v1/actor/${id}/tv`);
                setActorTVs(response.data.content.cast || []);
            } catch {
                toast.error("Error fetching TV shows...");
            }
        };

        fetchActorImages();
        fetchActorMovies();
        fetchActorTVs();
    }, [id]);

    const openModal = (title, content) => {
        setModalTitle(title);
        setModalContent(content);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const scrollLeft = (ref, section) => {
        ref.current.scrollBy({ left: -300, behavior: "smooth" });
        // Use setTimeout to allow the scroll animation to complete
        setTimeout(() => checkScrollPosition(ref.current, section), 400);
    };

    const scrollRight = (ref, section) => {
        ref.current.scrollBy({ left: 300, behavior: "smooth" });
        // Use setTimeout to allow the scroll animation to complete
        setTimeout(() => checkScrollPosition(ref.current, section), 400);
    };

    useEffect(() => {
        const moviesList = movieScrollRef.current;
        const tvList = tvScrollRef.current;
        const imagesList = imageScrollRef.current;

        const handleScroll = (element, section) => {
            checkScrollPosition(element, section);
        };

        if (moviesList) {
            moviesList.addEventListener('scroll', () => handleScroll(moviesList, 'movies'));
            // Initial check
            checkScrollPosition(moviesList, 'movies');
        }

        if (tvList) {
            tvList.addEventListener('scroll', () => handleScroll(tvList, 'tvShows'));
            checkScrollPosition(tvList, 'tvShows');
        }

        if (imagesList) {
            imagesList.addEventListener('scroll', () => handleScroll(imagesList, 'gallery'));
            checkScrollPosition(imagesList, 'gallery');
        }

        return () => {
            if (moviesList) {
                moviesList.removeEventListener('scroll', () => handleScroll(moviesList, 'movies'));
            }
            if (tvList) {
                tvList.removeEventListener('scroll', () => handleScroll(tvList, 'tvShows'));
            }
            if (imagesList) {
                imagesList.removeEventListener('scroll', () => handleScroll(imagesList, 'gallery'));
            }
        };
    }, [actorMovies, actorTVs, actorImages]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-r from-purple-800 via-blue-800 to-black p-10">
                <WatchPageSkeleton />
            </div>
        );
    }

    if (!actorDetails) {
        return (
            <div className="bg-slate-950 text-white h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-4xl sm:text-6xl font-extrabold text-balance bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                        Content not found 😥
                    </h2>
                    <p className="mt-4 text-lg text-slate-400">It looks like we couldn't find this actor's details.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-blue-950 text-white min-h-screen">
            <Navbar />
            <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle} content={modalContent} />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-20 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12">
                    <div className="flex flex-col items-center md:items-start">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                            <img 
                                src={`${ORIGINAL_IMG_BASE_URL}${actorDetails?.profile_path}`}
                                alt={actorDetails?.name}
                                className="relative sm:w-auto sm:h-72 md:w-96 md:h-auto rounded-lg shadow-2xl object-cover transform transition-all duration-500 hover:scale-105"
                            />
                        </div>
                        <div className="text-center md:ml-20 mt-6 space-y-2">
                            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                                {actorDetails?.name}
                            </h1>
                            <p className="text-blue-400 text-xl font-medium">
                                {actorDetails?.known_for_department}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-8 backdrop-blur-sm bg-slate-900/50 p-8 rounded-2xl shadow-xl">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-semibold text-blue-400">Biography</h2>
                            <p className="text-slate-300 leading-relaxed">
                                {showBio ? actorDetails?.biography : `${actorDetails?.biography.slice(0, 400)}`}
                                {actorDetails?.biography.length > 400 && (
                                    <button
                                        onClick={() => setShowBio(!showBio)}
                                        className="ml-2 text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                        {showBio ? "See Less" : "See More"}
                                    </button>
                                )}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-3xl font-semibold text-blue-400">Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center space-x-3">
                                    <Calendar className="text-blue-400" />
                                    <div>
                                    <p className="text-slate-400 text-sm">Birthday</p>
                                    <p className="text-slate-200">
                                        {actorDetails?.birthday ? (
                                        <>
                                            {actorDetails?.birthday} 
                                            {actorDetails?.deathday 
                                            ? ` - ${actorDetails?.deathday} (Age: ${calculateAge(actorDetails?.birthday, actorDetails?.deathday)})` 
                                            : ` (Age: ${calculateAge(actorDetails?.birthday, actorDetails?.deathday)})`
                                            }
                                        </>
                                        ) : "N/A"}
                                    </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <MapPin className="text-blue-400" />
                                    <div>
                                        <p className="text-slate-400 text-sm">Place of Birth</p>
                                        <p className="text-slate-200">{actorDetails?.place_of_birth || "N/A"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <User className="text-blue-400" />
                                    <div>
                                        <p className="text-slate-400 text-sm">Gender</p>
                                        <p className="text-slate-200">{actorDetails?.gender === 1 ? "Female" : "Male"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Star className="text-blue-400" />
                                    <div>
                                        <p className="text-slate-400 text-sm">Popularity</p>
                                        <p className="text-slate-200">{actorDetails?.popularity}</p>
                                    </div>
                                </div>

                                {actorDetails?.also_known_as && actorDetails.also_known_as.length > 0 && (
                                    <div className="mt-4">
                                        <h3 className="text-xl font-semibold text-blue-400 mb-2">Also Known As</h3>
                                        <div className="flex flex-wrap gap-2">
                                        {actorDetails.also_known_as.map((name, index) => (
                                            <span 
                                            key={index} 
                                            className="bg-slate-700 text-slate-200 px-2 py-1 rounded text-sm"
                                            >
                                            {name}
                                            </span>
                                        ))}
                                        </div>
                                    </div>
                                    )}
                                
                                <div className="flex space-x-4 mt-4">
                                    {/* Homepage Link */}
                                    {actorDetails?.homepage && (
                                        <a
                                        href={actorDetails?.homepage}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                                        >
                                        <LinkIcon size={16} />
                                        <span>Website</span>
                                        </a>
                                    )}

                                    {/* IMDB Link */}
                                    {actorDetails?.imdb_id && (
                                        <a
                                        href={`https://www.imdb.com/name/${actorDetails.imdb_id}/`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                                        >
                                        <ExternalLink size={16} />
                                        <span>Learn More</span>
                                        </a>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                {/* Movies Section */}
                {actorMovies.length > 0 && (
                    <div className="relative space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-semibold text-blue-400 flex items-center gap-2">
                                <Film />
                                <span>Movies</span>
                            </h2>
                            <button 
                                onClick={() => openModal("All Movies", [...new Map(actorMovies.filter(movie => movie.poster_path).map(movie => [movie.id, movie])).values()])}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-full text-white transition-colors"
                            >
                                View All
                            </button>
                        </div>

                        <div className="relative group">
                            {!scrollPositions.movies.isAtStart && (
                                <button
                                    onClick={() => scrollLeft(movieScrollRef, 'movies')}
                                    className="absolute left-0 z-10 p-3 bg-slate-800/90 rounded-full top-1/2 transform -translate-y-1/2 shadow-xl hover:bg-slate-700/90 transition-colors"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                            )}
                            
                            <div ref={movieScrollRef} className="flex overflow-x-scroll gap-6 p-4 scrollbar-hide">
                                {actorMovies.filter(movie => movie.poster_path).map((movie, idx) => (
                                    <Link 
                                        key={idx}
                                        to={`/movie/moreinfo/${movie.id}`}
                                        onClick={() => useContentStore.getState().setContentType('movie')}
                                        className="relative flex-shrink-0"
                                    >
                                        <div className="w-64 h-96 overflow-hidden rounded-lg relative">
                                            <img
                                                src={`${ORIGINAL_IMG_BASE_URL}${movie.poster_path}`}
                                                alt={movie.title}
                                                className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                            <div className="space-y-1">
                                                <p className="text-white font-medium">{movie.title}</p>
                                                {movie.character && (
                                                    <p className="text-blue-300 text-sm">as {movie.character}</p>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {!scrollPositions.movies.isAtEnd && (
                                <button
                                    onClick={() => scrollRight(movieScrollRef, 'movies')}
                                    className="absolute right-0 z-10 p-3 bg-slate-800/90 rounded-full top-1/2 transform -translate-y-1/2 shadow-xl hover:bg-slate-700/90 transition-colors"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* TV Shows Section - Similar structure to Movies section */}
                {actorTVs.length > 0 && (
                    <div className="relative space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-semibold text-blue-400 flex items-center gap-2">
                                <Tv />
                                <span>TV Shows</span>
                            </h2>
                            <button 
                                onClick={() => openModal("All TV Shows", [...new Map(actorTVs.filter(tv => tv.poster_path).map(tv => [tv.id, tv])).values()])}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-full text-white transition-colors"
                            >
                                View All
                            </button>
                        </div>

                        <div className="relative group">
                            {!scrollPositions.tvShows.isAtStart && (
                                <button
                                    onClick={() => scrollLeft(tvScrollRef, 'tvShows')}
                                    className="absolute left-0 z-10 p-3 bg-slate-800/90 rounded-full top-1/2 transform -translate-y-1/2 shadow-xl hover:bg-slate-700/90 transition-colors"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                            )}
                            
                            <div ref={tvScrollRef} className="flex overflow-x-scroll gap-6 p-4 scrollbar-hide">
                                {actorTVs.filter(tv => tv.poster_path).map((show, idx) => (
                                    <Link 
                                        key={idx}
                                        to={`/tv/moreinfo/${show.id}`}
                                        className="relative flex-shrink-0"
                                        onClick={() => useContentStore.getState().setContentType('tv')}
                                    >
                                        <div className="w-64 h-96 overflow-hidden rounded-lg shadow-lg">
                                            <img
                                                src={`${ORIGINAL_IMG_BASE_URL}${show.poster_path}`}
                                                alt={show.name}
                                                className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                            <div className="space-y-1">
                                                <p className="text-white font-medium">{show.name}</p>
                                                {show.character && (
                                                    <p className="text-blue-300 text-sm">as {show.character}</p>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {!scrollPositions.tvShows.isAtEnd && (
                                <button
                                    onClick={() => scrollRight(tvScrollRef, 'tvShows')}
                                    className="absolute right-0 z-10 p-3 bg-slate-800/90 rounded-full top-1/2 transform -translate-y-1/2 shadow-xl hover:bg-slate-700/90 transition-colors"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Photo Gallery Section - Similar structure to above sections */}
                {actorImages.length > 0 && (
                    <div className="relative space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-semibold text-blue-400 flex items-center gap-2">
                                <Camera />
                                <span>Photo Gallery</span>
                            </h2>
                            <button 
                                onClick={() => openModal("Photo Gallery", [...new Map(actorImages.filter(img => img.file_path).map(img => [img.file_path, img])).values()])}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-full text-white transition-colors"
                            >
                                View All
                            </button>
                        </div>

                        <div className="relative group">
                            {!scrollPositions.gallery.isAtStart && (
                                <button
                                    onClick={() => scrollLeft(imageScrollRef, 'gallery')}
                                    className="absolute left-0 z-10 p-3 bg-slate-800/90 rounded-full top-1/2 transform -translate-y-1/2 shadow-xl hover:bg-slate-700/90 transition-colors"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                            )}
                            
                            <div ref={imageScrollRef} className="flex overflow-x-scroll gap-6 p-4 scrollbar-hide">
                                {actorImages.filter(img => img.file_path).map((image, idx) => (
                                    <div 
                                        key={idx}
                                        className="relative flex-shrink-0 cursor-pointer"
                                        onClick={() => openModal("Photo Gallery", [image])}
                                    >
                                        <div className="w-64 h-96 overflow-hidden rounded-lg shadow-lg bg-slate-800">
                                            <img
                                                src={`${ORIGINAL_IMG_BASE_URL}${image.file_path}`}
                                                alt={`${actorDetails.name} - Photo ${idx + 1}`}
                                                className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                                            <div className="px-4 py-2 bg-blue-600/80 rounded-full backdrop-blur-sm">
                                                <p className="text-white text-sm">Click to View</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {!scrollPositions.gallery.isAtEnd && (
                                <button
                                    onClick={() => scrollRight(imageScrollRef, 'gallery')}
                                    className="absolute right-0 z-10 p-3 bg-slate-800/90 rounded-full top-1/2 transform -translate-y-1/2 shadow-xl hover:bg-slate-700/90 transition-colors"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActorPage;

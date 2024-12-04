import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import { ChevronLeft, ChevronRight, Film, Tv, Camera } from "lucide-react";
import { useContentStore } from "../store/content";
import Modal from "../components/actors/Modal.jsx";
import { ActorHeader } from "../components/actors/ActorHeader";
import { ActorBody } from "../components/actors/ActorBody";
import ActorPageLoading from "../components/skeletons/ActorLoading.jsx"

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

    const [isInitialMount, setIsInitialMount] = useState(true);

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

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                // Fetch actor details first
                const detailsResponse = await axios.get(`/api/v1/actor/${id}`);
                setActorDetails(detailsResponse.data.content);
    
                // Concurrent fetches for other data
                const [imagesResponse, moviesResponse, tvResponse] = await Promise.all([
                    axios.get(`/api/v1/actor/${id}/images`).catch(() => ({ data: { content: { profiles: [] } } })),
                    axios.get(`/api/v1/actor/${id}/movies`).catch(() => ({ data: { content: { cast: [] } } })),
                    axios.get(`/api/v1/actor/${id}/tv`).catch(() => ({ data: { content: { cast: [] } } }))
                ]);
    
                setActorImages(imagesResponse.data.content.profiles || []);
                setActorMovies(moviesResponse.data.content.cast || []);
                setActorTVs(tvResponse.data.content.cast || []);
            } catch (error) {
                toast.error(
                    error.response?.status === 404
                        ? "Nothing found, make sure you are searching under the right category"
                        : "An error occurred, please try again later"
                );
                setActorDetails(null); // Ensure details are set to null on error
            } finally {
                setLoading(false);
                setIsInitialMount(false);
            }
        };
    
        fetchAllData();
    }, [id]);

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

    if (isInitialMount || loading) {
        return <ActorPageLoading />;
    }

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

    const consolidatedMovies = actorMovies.reduce((acc, movie) => {
        const existingMovie = acc.find(m => m.id === movie.id);
        if (existingMovie) {
            // If movie already exists, append the new role to characters
            if (movie.character && !existingMovie.characters.includes(movie.character)) {
                existingMovie.characters.push(movie.character);
            }
            return acc;
        }
        // If movie doesn't exist, add it with characters array
        return [...acc, { ...movie, characters: [movie.character].filter(Boolean) }];
    }, []);

    const consolidatedTVs = actorTVs.reduce((acc, show) => {
        const existingShow = acc.find(s => s.id === show.id);
        if (existingShow) {
            // If show already exists, append the new role to characters
            if (show.character && !existingShow.characters.includes(show.character)) {
                existingShow.characters.push(show.character);
            }
            return acc;
        }
        // If show doesn't exist, add it with characters array
        return [...acc, { ...show, characters: [show.character].filter(Boolean) }];
    }, []);

    return (
        <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-blue-950 text-white min-h-screen">
            <Navbar />
            <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle} content={modalContent} />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-20 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12">
                    {/* actor header */}
                    <ActorHeader actorDetails={actorDetails} ORIGINAL_IMG_BASE_URL={ORIGINAL_IMG_BASE_URL}/>
                    {/* actor body */}
                    <ActorBody actorDetails={actorDetails} showBio={showBio} setShowBio={setShowBio}/>
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
                                {consolidatedMovies.filter(movie => movie.poster_path).map((movie, idx) => (
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
                                                {movie.characters.length > 0 && (
                                                    <p className="text-blue-300 text-sm">as {movie.characters.join(", ")}</p>
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

                {/* TV Shows Section */}
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
                                {consolidatedTVs.filter(tv => tv.poster_path).map((show, idx) => (
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
                                                {show.characters.length > 0 && (
                                                    <p className="text-blue-300 text-sm">as {show.characters.join(", ")}</p>
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
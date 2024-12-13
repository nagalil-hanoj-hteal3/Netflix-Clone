import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import Modal from "../components/actors/Modal.jsx";
import { ActorHeader } from "../components/actors/ActorHeader";
import { ActorBody } from "../components/actors/ActorBody";
import ActorPageLoading from "../components/skeletons/ActorLoading.jsx"
import { ActorMovies } from "../components/actors/ActorMovies";
import ActorTV from "../components/actors/ActorTV.jsx";
import ActorGallery from "../components/actors/ActorGallery.jsx";

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
                <ActorMovies 
                    actorMovies={actorMovies}
                    scrollPositions={scrollPositions}
                    movieScrollRef={movieScrollRef}
                    scrollLeft={scrollLeft}
                    scrollRight={scrollRight}
                    openModal={openModal}
                />
                

                {/* TV Shows Section */}
                <ActorTV 
                    actorTVs={actorTVs}
                    scrollPositions={scrollPositions}
                    tvScrollRef={tvScrollRef}
                    scrollLeft={scrollLeft}
                    scrollRight={scrollRight}
                    openModal={openModal}
                />

                {/* Photo Gallery Section - Similar structure to above sections */}
                <ActorGallery
                    actorDetails={actorDetails}
                    actorImages={actorImages}
                    scrollPositions={scrollPositions}
                    imageScrollRef={imageScrollRef}
                    scrollLeft={scrollLeft}
                    scrollRight={scrollRight}
                    openModal={openModal}
                />

            </div>
        </div>
    );
};

export default ActorPage;
import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import WatchPageSkeleton from "../components/skeletons/WatchPageSkeleton";
import Navbar from "../components/Navbar";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useContentStore } from "../store/content";

const calculateAge = (birthday, deathday = null) => {
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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-4xl md:max-w-3xl sm:max-w-xl text-white relative">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 overflow-y-auto max-h-96">
                    {content.map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center relative group">
                            {/* Link around the image */}
                            {item.id ? (
                                <Link
                                    to={`/${title.includes("Movies") ? 'movie' : 'tv'}/moreinfo/${item.id}`}
                                    onClick={() =>
                                        useContentStore
                                            .getState()
                                            .setContentType(title.includes("Movies") ? 'movie' : 'tv')
                                    }
                                    className="w-32 h-48 bg-gray-300 rounded-lg shadow-lg mb-2 group-hover:scale-110 transform transition-all duration-300 ease-in-out"
                                >
                                    <img
                                        src={`${ORIGINAL_IMG_BASE_URL}${item.poster_path || item.file_path}`}
                                        alt={item.title || item.name || `Image ${idx + 1}`}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </Link>
                            ) : (
                                <div className="w-32 h-48 bg-gray-300 rounded-lg shadow-lg mb-2">
                                    <img
                                        src={`${ORIGINAL_IMG_BASE_URL}${item.poster_path || item.file_path}`}
                                        alt={item.title || item.name || `Image ${idx + 1}`}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                            )}

                            {/* Hover Popup Text */}
                            {(item.title || item.name) && (
                                <p className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4 text-sm text-white bg-black bg-opacity-75 rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                                    {item.title || item.name}
                                </p>
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

    const scrollLeft = (ref) => ref.current.scrollBy({ left: -300, behavior: "smooth" });
    const scrollRight = (ref) => ref.current.scrollBy({ left: 300, behavior: "smooth" });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-r from-purple-800 via-blue-800 to-black p-10">
                <WatchPageSkeleton />
            </div>
        );
    }

    if (!actorDetails) {
        return (
            <div className="bg-black text-white h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-4xl sm:text-6xl font-extrabold text-balance">Content not found 😥</h2>
                    <p className="mt-4 text-lg text-gray-400">It looks like we couldn't find this actor's details.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white">
            <Navbar />
            <Modal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    title={modalTitle}
                    content={modalContent}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
                    <div className="flex flex-col items-center md:items-start">
                        <img src={`${ORIGINAL_IMG_BASE_URL}${actorDetails?.profile_path}`}
                            alt={actorDetails?.name}
                            className="w-64 h-96 rounded-lg shadow-2xl transform transition-all hover:scale-105 mb-4 mt-3 items-center"
                        />
                        <div className="text-center md:text-center ">
                            <h1 className="text-4xl font-extrabold mb-2">{actorDetails?.name}</h1>
                            <p className="italic text-rose-400 text-xl">{actorDetails?.known_for_department}</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="mb-4">
                            <h2 className="text-3xl font-semibold mb-2">Biography</h2>
                            <p className="text-gray-300">
                                {showBio ? actorDetails?.biography : `${actorDetails?.biography.slice(0, 400)}`}
                                {actorDetails?.biography.length > 400 && (
                                    <button
                                        onClick={() => setShowBio(!showBio)}
                                        className="text-blue-600 hover:underline ml-2"
                                    >
                                        {showBio ? "See Less" : "See More"}
                                    </button>
                                )}
                            </p>
                        </div>

                        <div>
                            <h2 className="text-3xl font-semibold mb-2">Details</h2>
                            <ul className="list-disc ml-6 text-gray-300 space-y-2">
                                <li>
                                    <strong>Birthday: </strong> 
                                    {actorDetails?.birthday ? (
                                        <>
                                            {actorDetails?.birthday} (Age: {calculateAge(actorDetails?.birthday, actorDetails?.deathday)})
                                        </>
                                    ) : ("N/A")}
                                </li>
                                {actorDetails?.deathday && <li><strong>Death Date:</strong> {actorDetails?.deathday}</li>}
                                <li><strong>Place of Birth:</strong> {actorDetails?.place_of_birth || "N/A"}</li>
                                <li><strong>Gender:</strong> {actorDetails?.gender === 1 ? "Female" : "Male"}</li>
                                <li>
                                    <strong>Learn More:</strong>{" "}
                                    <a href={`https://www.imdb.com/name/${actorDetails?.imdb_id}`}
                                        target="_blank" rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-400 underline">
                                        Click Here
                                    </a>
                                </li>
                                <li><strong>Also Known As:</strong> {actorDetails?.also_known_as?.join(", ") || "N/A"}</li>
                                <li><strong>Popularity:</strong> {actorDetails?.popularity}</li>
                            </ul>
                        </div>

                        {actorDetails?.homepage && (
                            <div className="mt-4">
                                <h2 className="text-3xl font-semibold mb-2">Official Website</h2>
                                <a
                                    href={actorDetails?.homepage}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-400 underline"
                                >
                                    Visit Website
                                </a>
                            </div>
                        )}
                    </div>

                </div>

                {/* Scrollable Movie/TV Show/Images Sections */}
                {[
                    { label: 'Movies', items: [...new Map(actorMovies .filter(movie => movie.poster_path) .map(movie => [movie.id, movie])) .values()],  ref: movieScrollRef },
                    { label: 'TV Shows', items: [...new Map(actorTVs .filter(tv => tv.poster_path) .map(tv => [tv.id, tv])) .values()],  ref: tvScrollRef },
                    { label: 'Photo Gallery', items: [...new Map(actorImages .filter(img => img.file_path) .map(img => [img.file_path, img])) .values()], ref: imageScrollRef }
                ].map(({ label, items, ref }, index) => {
                    // Filter items to include only those with a valid poster or file path
                    const filteredItems = items.filter(item => item.poster_path || item.file_path);

                    // If no valid items, skip rendering this section
                    if (filteredItems.length === 0) return null;

                    return (
                        <div key={index} className="relative mt-8">
                            <h2 className="text-3xl font-semibold mb-4 text-center">{`${actorDetails?.name.split(" ")[0]}'s ${label}`}</h2>

                            {/* Add "Display All" buttons */}
                            <div className="flex justify-center gap-4 mb-4">
                                {label === 'Movies' && (
                                    <button onClick={() => openModal("All Movies", [...new Map(actorMovies .filter(movie => movie.poster_path) .map(movie => [movie.id, movie])) .values()])} className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-2 rounded-full shadow-md transition-transform transform hover:scale-105">
                                        Display All Movies
                                    </button>
                                )}
                                {label === 'TV Shows' && (
                                    <button onClick={() => openModal("All TV Shows", [...new Map(actorTVs .filter(tv => tv.poster_path) .map(tv => [tv.id, tv])) .values()])} className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-2 rounded-full shadow-md transition-transform transform hover:scale-105">
                                        Display All TV Shows
                                    </button>
                                )}
                                {label === 'Photo Gallery' && (
                                    <button onClick={() => openModal("Photo Gallery", [...new Map(actorImages .filter(img => img.file_path) .map(img => [img.file_path, img])) .values()])} className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-2 rounded-full shadow-md transition-transform transform hover:scale-105">
                                        Display All Images
                                    </button>
                                )}
                            </div>

                            {/* Horizontal scroll section */}
                            <button  onClick={() => scrollLeft(ref)} className="absolute left-0 z-10 p-2 bg-gray-700 rounded-full top-1/2 transform -translate-y-1/2 shadow-md hover:bg-gray-600" >
                                <ChevronLeft size={24} />
                            </button>
                            
                            <div ref={ref} className="flex overflow-x-scroll gap-6 p-4 scrollbar-hide">
                            {filteredItems.map((item, idx) => (
                                <div key={idx} className="flex-shrink-0 w-64 h-96 group relative">
                                    {label === 'Photo Gallery' ? (
                                        <div className="w-full h-full object-cover rounded-lg shadow-lg bg-gray-300">
                                            {/* Placeholder for the image, can add a disabled message or style */}
                                            <img
                                                src={`${ORIGINAL_IMG_BASE_URL}${item.poster_path || item.file_path}`}
                                                alt={item.title || item.name || `Image ${idx + 1}`}
                                                className="w-full h-full object-cover rounded-lg shadow-lg transform transition-transform hover:scale-105"
                                                onLoad={() => setLoading(false)}
                                            />
                                        </div>
                                    ) : (
                                        <Link to={`/${label === 'Movies' ? 'movie' : 'tv'}/moreinfo/${item.id}`}
                                            onClick={() => useContentStore .getState() .setContentType(label === 'Movies' ? 'movie' : 'tv') } >
                                            <img
                                                src={`${ORIGINAL_IMG_BASE_URL}${item.poster_path || item.file_path}`}
                                                alt={item.title || item.name || `Image ${idx + 1}`}
                                                className="w-full h-full object-cover rounded-lg shadow-lg transform transition-all hover:scale-105"
                                            />
                                        </Link>
                                    )}
                                </div>
                            ))}

                            </div>
                            <button
                                onClick={() => scrollRight(ref)}
                                className="absolute right-0 z-10 p-2 bg-gray-700 rounded-full top-1/2 transform -translate-y-1/2 shadow-md hover:bg-gray-600"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    );
                })}


            </div>
        </div>
    );
};

export default ActorPage;

import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import WatchPageSkeleton from "../components/skeletons/WatchPageSkeleton";
import Navbar from "../components/Navbar";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import { ChevronLeft, ChevronRight } from "lucide-react";

const calculateAge = (birthday) => {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age;
};

export const ActorPage = () => {
    const { id } = useParams();
    const [actorDetails, setActorDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showBio, setShowBio] = useState(false);

    const [actorImages, setActorImages] = useState([]);
    const [actorMovies, setActorMovies] = useState([]);
    const [actorTVs, setActorTVs] = useState([]);

    const movieScrollRef = useRef();
    const tvScrollRef = useRef();
    const imageScrollRef = useRef();

    useEffect(() => {
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
        fetchActorDetails();
    }, [id]);

    useEffect(() => {
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
                toast.error("Error fetching movie...");
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
                    <div className="flex flex-col items-center md:items-start">
                        <img src={`${ORIGINAL_IMG_BASE_URL}${actorDetails.profile_path}`}
                            alt={actorDetails.name}
                            className="w-64 h-96 rounded-lg shadow-2xl transform transition-all hover:scale-105 mb-4 mt-3"
                        />
                        <div className="text-center md:text-left md:ml-7">
                            <h1 className="text-4xl font-extrabold mb-2">{actorDetails.name}</h1>
                            <p className="italic text-rose-400 text-xl">{actorDetails.known_for_department}</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="mb-4">
                            <h2 className="text-3xl font-semibold mb-2">Biography</h2>
                            <p className="text-gray-300">
                                {showBio ? actorDetails.biography : `${actorDetails.biography.slice(0, 400)}`}
                                {actorDetails.biography.length > 400 && (
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
                                    <strong>Birthday:</strong> 
                                    {actorDetails.birthday ? (
                                        <>
                                            {actorDetails.birthday} (Age: {calculateAge(actorDetails.birthday)})
                                        </>
                                    ) : ("N/A")}
                                </li>
                                {actorDetails.deathday && <li><strong>Death Date:</strong> {actorDetails.deathday}</li>}
                                <li><strong>Place of Birth:</strong> {actorDetails.place_of_birth || "N/A"}</li>
                                <li><strong>Gender:</strong> {actorDetails.gender === 1 ? "Female" : "Male"}</li>
                                <li>
                                    <strong>Learn More:</strong>{" "}
                                    <a href={`https://www.imdb.com/name/${actorDetails.imdb_id}`}
                                        target="_blank" rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-400 underline">
                                        Click Here
                                    </a>
                                </li>
                                <li><strong>Also Known As:</strong> {actorDetails.also_known_as?.join(", ") || "N/A"}</li>
                                <li><strong>Popularity:</strong> {actorDetails.popularity}</li>
                            </ul>
                        </div>

                        {actorDetails.homepage && (
                            <div className="mt-4">
                                <h2 className="text-3xl font-semibold mb-2">Official Website</h2>
                                <a
                                    href={actorDetails.homepage}
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
                {[{ label: 'Movies', items: actorMovies, ref: movieScrollRef }, { label: 'TV Shows', items: actorTVs, ref: tvScrollRef }, { label: 'Images', items: actorImages, ref: imageScrollRef }]
                .map(({ label, items, ref }, index) => (
                    <div key={index} className="relative mt-8">
                        <h2 className="text-3xl font-semibold mb-4 text-center">{`${actorDetails.name.split(" ")[0]}'s ${label}`}</h2>
                        <button onClick={() => scrollLeft(ref)} className="absolute left-0 z-10 p-2 bg-gray-700 rounded-full top-1/2 transform -translate-y-1/2 shadow-md hover:bg-gray-600">
                            <ChevronLeft size={24} />
                        </button>
                        <div ref={ref} className="flex overflow-x-scroll gap-6 p-4 scrollbar-hide">
                            {items.length > 0 ? (
                                items.map((item, idx) => (
                                    <div key={idx} className="flex-shrink-0 w-64 h-96">
                                        {(label === 'Movies' || label === 'TV Shows') ? (
                                            <Link to={`/${label === 'Movies' ? 'movie' : 'tv'}/moreinfo/${item.id}`}>
                                                <img
                                                    src={`${ORIGINAL_IMG_BASE_URL}${item.poster_path || item.file_path}`}
                                                    alt={item.title || item.name || `Image ${idx + 1}`}
                                                    className="w-full h-full object-cover rounded-lg shadow-lg transform transition-all hover:scale-105"
                                                />
                                            </Link>
                                        ) : (
                                            <img
                                                src={`${ORIGINAL_IMG_BASE_URL}${item.file_path}`}
                                                alt={`Image ${idx + 1}`}
                                                className="w-full h-full object-cover rounded-lg shadow-lg transform transition-all hover:scale-105"
                                            />
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-400">No {label.toLowerCase()} available</p>
                            )}
                        </div>
                        <button onClick={() => scrollRight(ref)} className="absolute right-0 z-10 p-2 bg-gray-700 rounded-full top-1/2 transform -translate-y-1/2 shadow-md hover:bg-gray-600">
                            <ChevronRight size={24} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActorPage;

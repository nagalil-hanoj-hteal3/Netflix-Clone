import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import WatchPageSkeleton from "../components/skeletons/WatchPageSkeleton";
import Navbar from "../components/Navbar";

export function ActorPage() {
    const { id } = useParams(); // Get actor ID from URL
    const [actorDetails, setActorDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showBio, setShowBio] = useState(false);

    useEffect(() => {
        const fetchActorDetails = async () => {
            try {
                const response = await axios.get(`/api/v1/actor/${id}`);
                setActorDetails(response.data.content); // Store actor details
            } catch (error) {
                if (error.response.status === 404) {
                    toast.error("Nothing found, make sure you are searching under the right category");
                } else {
                    toast.error("An error occurred, please try again later");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchActorDetails();
    }, [id]);

    if(loading) return (
        <div className="min-h-screen bg-black p-10">
            <WatchPageSkeleton/>
        </div>
    )

    if(!actorDetails) {
        return (
        <div className='bg-black text-white h-screen'>
				<div className='max-w-6xl mx-auto'>
					<Navbar />
					<div className='text-center mx-auto px-4 py-8 h-full mt-40'>
						<h2 className='text-2xl sm:text-5xl font-bold text-balance'>Content not found 😥</h2>
					</div>
				</div>
			</div>
        );
    }

    // console.log("details: ", actorDetails);

    return (
        <div className="bg-black min-h-screen text-white">
            <Navbar/>
            {/* Profile picture and name */}
            <div className="flex flex-col items-center">
                <img src={`https://image.tmdb.org/t/p/original${actorDetails.profile_path}`}
                alt={actorDetails.name}
                className="w-64 h-64 rounded-full mb-4"/>
                <h1 className="text-3xl font-bold mb-2">{actorDetails.name}</h1>
                <p className="italic text-rose-400">{actorDetails.known_for_department}</p>
            </div>
        
            {/* Biography and other details */}
            <div className="mt-8 max-w-7xl mx-auto px-4 sm:px-6">
                {actorDetails.biography ? (
                    <div className="mb-4">
                        <h2 className="text-2xl font-semibold mb-2">Biography</h2>
                        <p className="text-gray-300">
                            {showBio ? actorDetails.biography : `${actorDetails.biography?.slice(0, 400)}...`}
                            {" "}<button
                            onClick={() => setShowBio(!showBio)}
                            className="text-blue-600 hover:underline"
                        >
                            {showBio ? "See Less" : "See More"}
                        </button>
                        </p>
                    </div>
                ) : (
                    <p className="text-gray-300">No biography available.</p>
                )}
        
                <div className="mt-7">
                    <h2 className="text-2xl font-semibold mb-2">Details</h2>
                    <ul className="list-disc ml-6 text-gray-300">
                        <li><strong>Birthday:</strong> {actorDetails.birthday || "N/A"}</li>
                        {actorDetails.deathday && (
                        <li>
                            <strong>Death Date:</strong> {actorDetails.deathday}
                        </li>
                        )}
                        <li><strong>Place of Birth:</strong> {actorDetails.place_of_birth || "N/A"}</li>
                        <li><strong>Gender:</strong> {actorDetails.gender === 1 ? "Female" : "Male"}</li>
                        <li><strong>Learn More:</strong>{" "}<a href={`https://www.imdb.com/name/${actorDetails.imdb_id}`} target="_blank" 
                        rel="noopener noreferrer" className="hover:text-blue-600 hover:underline">{"Click Here"}</a></li>
                        <li><strong>Also Known As:</strong> {actorDetails.also_known_as?.join(", ") || "N/A"}</li>
                        <li><strong>Popularity:</strong> {actorDetails.popularity}</li>
                    </ul>
                </div>
        
                {actorDetails.homepage && (
                <div className="mt-4">
                    <h2 className="text-2xl font-semibold mb-2">Official Website</h2>
                    <a href={actorDetails.homepage} target="_blank"
                    rel="noopener noreferrer" className="hover:text-blue-600">
                        Visit Website
                    </a>
                </div>
                )}
            </div>
        </div>
      );
    
}

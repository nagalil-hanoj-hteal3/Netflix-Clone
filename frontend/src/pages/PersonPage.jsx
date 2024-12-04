import Navbar from "../components/Navbar";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, Film, User, ArrowUpRight, Globe } from 'lucide-react';
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import PersonPageLoading from "../components/skeletons/PersonPageLoading";

const PersonPage = () => {
    const navigate = useNavigate();
    const [popularPeople, setPopularPeople] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPopularPeople = async () => {
            try {
                const response = await axios.get('/api/v1/actor/popular');
                setPopularPeople(response.data.content.results);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch popular people', err);
                setLoading(false);
            }
        };

        fetchPopularPeople();
    }, []);

    const handlePersonClick = (personId) => {
        navigate(`/actor/${personId}`);
    };

    if (loading) { return ( <PersonPageLoading/> ); }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
                <div className="text-red-500 text-2xl">
                    Error: {error}
                    <button 
                        onClick={() => window.location.reload()}
                        className="ml-4 bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
            <Navbar />
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/50 p-6 shadow-2xl shadow-blue-900/20">
                    <h1 className="text-3xl font-bold text-white mb-8 flex items-center">
                        <User className="mr-4 text-blue-400" />
                        Popular Actors
                    </h1>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {popularPeople.map((person) => (
                            <div 
                                key={person.id} 
                                onClick={() => handlePersonClick(person.id)}
                                className="bg-slate-900/60 rounded-xl overflow-hidden 
                                    border border-slate-800/50 shadow-lg 
                                    hover:scale-105 hover:shadow-xl 
                                    hover:shadow-blue-500/20 transition-all duration-300 group 
                                    cursor-pointer relative"
                            >
                                <div className="absolute inset-0 z-10 
                                    bg-black/30 opacity-0 group-hover:opacity-100 
                                    transition-opacity duration-300 
                                    flex items-center justify-center">
                                    <ArrowUpRight 
                                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                                        size-12 text-white drop-shadow-lg" 
                                        strokeWidth={2} 
                                    />
                                </div>
                                <div className="relative overflow-hidden">
                                    {person.profile_path ? (
                                        <img 
                                            src={ORIGINAL_IMG_BASE_URL + person.profile_path} 
                                            alt={person.name}
                                            className="w-full h-auto object-cover 
                                                transition-transform group-hover:scale-110 
                                                group-hover:brightness-75"
                                        />
                                    ) : (
                                        <div className="w-full h-[400px] bg-slate-800 
                                            flex items-center justify-center text-slate-400">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h2 className="text-lg font-semibold text-white
                                        group-hover:text-blue-300 transition-colors mb-2">
                                        {person.name}
                                    </h2>
                                    
                                    <div className="space-y-2 mb-2">
                                        <div className="flex items-center text-sm text-slate-400">
                                            <Globe className="size-4 mr-2" />
                                            <span>{person.original_name}</span>
                                        </div>
                                        
                                        <div className="flex items-center text-sm text-slate-400">
                                            <Film className="size-4 mr-2" />
                                            <span>{person.known_for_department}</span>
                                        </div>
                                    </div>

                                    <div className="mb-2">
                                        <div className="flex items-center text-sm text-slate-400 mb-1">
                                            <Star className="size-4 mr-2" />
                                            <span>Popularity</span>
                                        </div>
                                        <div className="w-full bg-slate-800 rounded-full h-2.5">
                                            <div 
                                                className="bg-blue-600 h-2.5 rounded-full" 
                                                style={{
                                                    width: `${Math.min(person.popularity / 3, 100)}%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="mt-2">
                                        <h3 className="text-sm font-semibold text-slate-300 mb-2">
                                            Known For
                                        </h3>
                                        <div className="space-y-1">
                                            {person.known_for.slice(0, 3).map((work) => (
                                                <div 
                                                    key={work.id} 
                                                    className="text-xs text-slate-400 
                                                    bg-slate-800/50 px-2 py-1 rounded 
                                                    flex items-center justify-between"
                                                >
                                                    <span>{work.title || work.name}</span>
                                                    {work.release_date && (
                                                        <span className="text-slate-500 ml-2">
                                                            {new Date(work.release_date).getFullYear()}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonPage;
import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useContentStore } from "../store/content";
import Navbar from "../components/Navbar";
import { Search, ArrowUpRight, ChevronDown } from "lucide-react";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import { fetchSearchResults } from "../utils/searchUtils";

export const SearchPage = () => {
	const { search } = useLocation();
	const navigate = useNavigate();

	const [activeTab, setActiveTab] = useState("movie");
	const [searchTerm, setSearchTerm] = useState("");
	const [hoveredId, setHoveredId] = useState(null);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const { setSearchResults, setContentType, searchResults } = useContentStore();

	const searchTypes = [
        { id: 'movie', label: 'Movies' },
        { id: 'tv', label: 'TV Shows' },
        { id: 'person', label: 'Person' }
    ];

	// Set active tab from URL query param
	useEffect(() => {
		const urlParams = new URLSearchParams(search);
		const tabFromUrl = urlParams.get("tab");
		if (tabFromUrl) {
			setActiveTab(tabFromUrl);
			setContentType(tabFromUrl);
		}
	}, [search, setContentType]);

	// Clear search results when activeTab changes
	useEffect(() => {
		setSearchResults([]);
	}, [activeTab, setSearchResults]);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (!event.target.closest('.dropdown-container')) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	}, []);

	// Handle tab click and update the active tab
	const handleTabClick = (tab) => {
		setActiveTab(tab);
		setContentType(tab);  // Update the content type in store
		setSearchTerm("");  // Clear search term when changing tabs
		setSearchResults([]);  // Clear previous search results
		setIsDropdownOpen(false);
		// Update the URL without reloading the page
		navigate(`?tab=${tab}`, { replace: true });
	};

	// Handle search form submission
	const handleSearch = async (e) => {
		e.preventDefault();
		const results = await fetchSearchResults(activeTab, searchTerm);
		setSearchResults(results);
	};

	const getCurrentLabel = () => {
        return searchTypes.find(type => type.id === activeTab)?.label;
    };

	return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                {/* Search Form with Dropdown */}
                <form 
                    className="flex flex-col sm:flex-row gap-3 mb-12 max-w-2xl mx-auto" 
                    onSubmit={handleSearch}
                >
                    {/* Dropdown */}
                    <div className="dropdown-container relative min-w-[140px]">
                        <button
                            type="button"
                            className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-700 text-white 
                                rounded-lg px-4 py-3 text-left flex items-center justify-between
                                hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 
                                focus:ring-blue-500"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsDropdownOpen(!isDropdownOpen);
                            }}
                        >
                            <span>{getCurrentLabel()}</span>
                            <ChevronDown 
                                className={`size-5 transition-transform duration-200 
                                    ${isDropdownOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute z-10 w-full mt-2 rounded-lg bg-slate-800 border 
                                border-slate-700 shadow-lg shadow-black/20 backdrop-blur-sm">
                                {searchTypes.map((type) => (
                                    <button
                                        key={type.id}
                                        type="button"
                                        className={`w-full px-4 py-2.5 text-left hover:bg-blue-600/20 
                                            transition-colors first:rounded-t-lg last:rounded-b-lg
                                            ${activeTab === type.id 
                                                ? 'bg-blue-600/20 text-blue-200' 
                                                : 'text-slate-200'}`}
                                        onClick={() => handleTabClick(type.id)}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Search Input and Button */}
                    <div className="flex-1 flex gap-2">
                        <input 
                            type="text" 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={`Search for a ${activeTab === "tv" ? "TV show" : activeTab}`}
                            className="flex-1 p-3 rounded-lg bg-slate-800/50 backdrop-blur-sm border 
                                border-slate-700 text-white placeholder:text-slate-400 focus:outline-none 
                                focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        <button 
                            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg 
                                transition-colors shadow-lg shadow-blue-500/30 flex-shrink-0"
                        >
                            <Search className="size-6" />
                        </button>
                    </div>
                </form>

                {/* Results Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {searchResults.map((result) => {
                        if (!result.poster_path && !result.profile_path) return null;

                        return (
                            <div 
                                key={result.id} 
                                className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-4 border border-slate-800 
                                    transition-all duration-300 hover:scale-105 hover:shadow-xl 
                                    hover:shadow-blue-500/10 group"
                                onMouseEnter={() => setHoveredId(result.id)}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                {activeTab === "person" ? (
                                    <Link 
                                        to={`/actor/${result.id}`} 
                                        className="block relative"
                                    >
                                        <div className="relative overflow-hidden rounded-lg">
                                            <img 
                                                src={ORIGINAL_IMG_BASE_URL + result.profile_path} 
                                                alt={result.name} 
                                                className="w-full h-auto rounded-lg transition-transform duration-300 
                                                    group-hover:brightness-75"
                                            />
                                            {hoveredId === result.id && (
                                                <div className="absolute inset-0 flex items-center justify-center 
                                                    bg-black/30 transition-opacity duration-300">
                                                    <ArrowUpRight className="size-8 text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <h2 className="mt-3 text-lg font-semibold text-white group-hover:text-blue-400 
                                            transition-colors">{result.name}</h2>
                                    </Link>
                                ) : (
                                    <Link
                                        to={`/${activeTab}/moreinfo/${result.id}`}
                                        onClick={() => setContentType(activeTab)}
                                        className="block relative"
                                    >
                                        <div className="relative overflow-hidden rounded-lg">
                                            <img
                                                src={ORIGINAL_IMG_BASE_URL + result.poster_path}
                                                alt={result.title || result.name}
                                                className="w-full h-auto rounded-lg transition-transform duration-300 
                                                    group-hover:brightness-75"
                                            />
                                            {hoveredId === result.id && (
                                                <div className="absolute inset-0 flex items-center justify-center 
                                                    bg-black/30 transition-opacity duration-300">
                                                    <ArrowUpRight className="size-8 text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <h2 className="mt-3 text-lg font-semibold text-white group-hover:text-blue-400 
                                            transition-colors">{result.title || result.name}</h2>
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useContentStore } from "../store/content";
import Navbar from "../components/Navbar";
import { Search, ArrowUpRight, ChevronDown, Filter, X } from "lucide-react";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import { fetchSearchResults, filterSearchResults, FILTER_OPTIONS, formatDate, getGenreNameById } from "../utils/searchUtils";

export const SearchPage = () => {
	const { search } = useLocation();
	const navigate = useNavigate();

	const [activeTab, setActiveTab] = useState("movie");
	const [searchTerm, setSearchTerm] = useState("");
	const [hoveredId, setHoveredId] = useState(null);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [filters, setFilters] = useState({});
	const [unfilteredResults, setUnfilteredResults] = useState([]);
	const { setSearchResults, setContentType, searchResults } = useContentStore();

	console.log("search results: ", searchResults);

	const searchTypes = [
        { id: 'movie', label: 'Movies' },
        { id: 'tv', label: 'TV Shows' },
        { id: 'person', label: 'Person' }
    ];

	const handleFilterChange = (key, value) => {
        setFilters(prev => {
			if (key === 'genre_id') {
				// If value is an empty array, remove the genre_id filter completely
				if (value.length === 0) {
					const { genre_id, ...rest } = prev;
					return rest;
				}
				// Otherwise, set the new genre_id array
				return {
					...prev,
					genre_id: value
				};
			}
			
			// For other filters, proceed as before
			return {
				...prev,
				[key]: value
			};
		});
    };

	const clearFilters = () => {
        setFilters({});
		applyFilters(unfilteredResults);
    };

	const applyFilters = (results) => {
        const filteredResults = filterSearchResults(
            results, 
            activeTab, 
            filters, 
            searchTerm
        );
        setSearchResults(filteredResults);
    };

	// Set active tab from URL query param
	useEffect(() => {
		const urlParams = new URLSearchParams(search);
		const tabFromUrl = urlParams.get("tab");
		if (tabFromUrl) {
			setActiveTab(tabFromUrl);
			setContentType(tabFromUrl);

			setSearchTerm("");
			setSearchResults([]);
			setUnfilteredResults([]);
			setFilters({});
		}
	}, [search, setContentType]);

	// Clear search results when activeTab changes
	useEffect(() => {
		setSearchTerm("");
		setSearchResults([]);
		setUnfilteredResults([]);
		setFilters({});
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

	const handleTabClick = (tab) => {
		setActiveTab(tab);
		setContentType(tab);  // Update the content type in store
		
		// Explicitly clear all search-related states
		setSearchTerm("");           // Clear search term
		setSearchResults([]);        // Clear search results
		setUnfilteredResults([]);    // Clear unfiltered results
		setFilters({});              // Reset all filters
		
		setIsDropdownOpen(false);
		
		// Update the URL without reloading the page
		navigate(`?tab=${tab}`, { replace: true });
	};

	// Handle search form submission
	const handleSearch = async (e) => {
		e.preventDefault();
		const results = await fetchSearchResults(activeTab, searchTerm);
		
		setUnfilteredResults(results);
		
		const filteredResults = filterSearchResults(
			results, 
			activeTab, 
			filters, 
			searchTerm
		);
		
		setSearchResults(filteredResults);
	};

	useEffect(() => {
        if (unfilteredResults.length > 0) {
            applyFilters(unfilteredResults);
        }
    }, [filters, searchTerm]);

	const renderFilters = () => {
		switch(activeTab) {
			case 'movie':
			case 'tv':
				return (
                    <div className="flex flex-wrap gap-4 w-full">
                        {/* Genre Filter */}
						<div className="relative w-full sm:w-auto flex-grow">
							<div className="bg-slate-800 rounded-lg p-2">
								{/* Selected Genres Display */}
								<div className="flex flex-wrap gap-2 mb-2">
									{filters.genre_id && Array.isArray(filters.genre_id) && 
										filters.genre_id.map((genreId) => (
											<span 
												key={genreId} 
												className="bg-blue-600/20 text-blue-200 px-2 py-1 
													rounded-full text-sm flex items-center gap-2"
											>
												{getGenreNameById(activeTab, genreId)}
												<button 
													onClick={() => {
														setFilters(prev => ({
															...prev,
															genre_id: prev.genre_id.filter(id => id !== genreId)
														}));
													}}
												>
													<X className="size-4" />
												</button>
											</span>
										))
									}
								</div>

								{/* Custom Multi-Select Dropdown */}
								<div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
									{FILTER_OPTIONS[activeTab].genres.map(genre => (
										<label 
											key={genre.id} 
											className="flex items-center space-x-2 cursor-pointer"
										>
											<input 
												type="checkbox"
												value={genre.id}
												checked={filters.genre_id?.includes(genre.id) || false}
												onChange={(e) => {
													const genreId = Number(e.target.value);
													setFilters(prev => {
														const currentGenres = prev.genre_id || [];
														const newGenres = e.target.checked
															? [...currentGenres, genreId]
															: currentGenres.filter(id => id !== genreId);
														
														return {
															...prev,
															genre_id: newGenres
														};
													});
												}}
												className="form-checkbox h-4 w-4 text-blue-600 bg-slate-800 border-slate-700 rounded"
											/>
											<span className="text-white text-sm">{genre.name}</span>
										</label>
									))}
								</div>
							</div>
						</div>

                        {/* Release Date Filter */}
						<div className="relative w-full sm:w-auto flex-grow">
							<select 
								value={filters.release_date || ''}
								onChange={(e) => handleFilterChange('release_date', e.target.value)}
								className="w-full bg-slate-800 text-white p-2 rounded-lg"
							>
								<option value="">Release Year</option>
								{FILTER_OPTIONS[activeTab].releaseDates.map(year => (
									<option key={year.value} value={year.value}>
										{year.label}
									</option>
								))}
							</select>
						</div>
						
						{/* Vote Average Filter */}
						<div className="relative w-full sm:w-auto flex-grow">
							<select 
								value={filters.vote_average || ''}
								onChange={(e) => handleFilterChange('vote_average', e.target.value)}
								className="w-full bg-slate-800 text-white p-2 rounded-lg"
							>
								<option value="">Rating</option>
								{FILTER_OPTIONS.movie.voteAverages.map(rating => (
									<option key={rating.value} value={rating.value}>
										{rating.label}
									</option>
								))}
							</select>
						</div>
                    </div>
                );
			case 'person':
				return (
					<div className="flex flex-wrap gap-4 w-full">
						{/* Gender Filter */}
						<div className="relative w-full sm:w-auto flex-grow">
							<select
								value={filters.gender || []}
								onChange={(e) => {
									const selectedGenders = Array.from(e.target.selectedOptions, option => option.value);
									handleFilterChange('gender', selectedGenders);
								}}
								className="w-full bg-slate-800 text-white p-2 rounded-lg max-h-48 overflow-y-auto"
							>
								<option value="">All Genders</option>
								{FILTER_OPTIONS.person.genders.map(gender => (
									<option key={gender.id} value={gender.id}>
										{gender.name}
									</option>
								))}
							</select>
						</div>
					</div>
				);
			default:
				return null;
		}
	};

	const renderKnownFor = (result) => {
        if (activeTab !== 'person' || !result.known_for) return null;

        return (
            <div className="mt-3 space-y-2">
                <h3 className="text-sm font-medium text-slate-400">Known For:</h3>
                <div className="grid grid-cols-3 gap-2">
                    {result.known_for.slice(0, 3).map((item) => (
                        <div 
                            key={item.id} 
                            className="relative rounded-lg overflow-hidden group"
                        >
                            <img 
                                src={ORIGINAL_IMG_BASE_URL + (item.poster_path || item.backdrop_path)} 
                                alt={item.title || item.name} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                            />
                            <div className="absolute bottom-0 left-0 right-0 
                                bg-black/70 p-1 truncate text-center">
                                <p className="text-xs text-white">
                                    {item.title || item.name}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

	return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
            <Navbar />
			<div className="container mx-auto px-4 py-8 max-w-7xl">
				<div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/50 p-6 shadow-2xl shadow-blue-900/20">
					{/* Search Form with Dropdown */}
					<form 
						className="flex flex-col md:flex-row gap-4 mb-6" 
						onSubmit={handleSearch}
					>
						{/* Dropdown */}
						<div className="relative w-full md:w-48">
							<button
								type="button"
								className="w-full bg-slate-800/70 text-white rounded-lg px-4 py-3 
                                    flex items-center justify-between hover:bg-slate-700 
                                    transition-colors group"
								onClick={(e) => {
									e.stopPropagation();
									setIsDropdownOpen(!isDropdownOpen);
								}}
							>
								<span>{searchTypes.find(type => type.id === activeTab)?.label}</span>
								<ChevronDown 
									className={`size-5 text-slate-400 group-hover:text-white 
                                        transition-transform
										${isDropdownOpen ? 'rotate-180' : ''}`}
								/>
							</button>

							{/* Dropdown Menu */}
							{isDropdownOpen && (
								<div className="absolute z-20 w-full mt-2 rounded-lg bg-slate-800 
									border border-slate-700 shadow-lg overflow-hidden">
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
						<div className="flex-1 flex items-center gap-2">
                            <div className="relative flex-1">
                                <input 
                                    type="text" 
                                    value={searchTerm} 
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder={`Search for a ${activeTab === "tv" ? "TV show" : activeTab}...`}
                                    className="w-full p-3 pl-10 bg-slate-800/70 rounded-lg 
                                        border border-slate-700 focus:outline-none 
                                        focus:ring-2 focus:ring-blue-500 text-white"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 
                                    size-5 text-slate-400" />
                            </div>
                            <button 
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white p-3 
                                    rounded-lg transition-colors flex items-center justify-center"
                            >
                                <Search className="size-6" />
                            </button>
                        </div>

						{/* Filter Toggle */}
                        <div className="relative">
                            <button 
                                type="button" 
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className={`p-3 rounded-lg transition-colors ${
                                    isFilterOpen 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700'
                                }`}
                            >
                                {isFilterOpen ? <X className="size-6" /> : <Filter className="size-6" />}
                            </button>
                        </div>
					</form>

					{/* Filter Section */}
                    {isFilterOpen && (
                        <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
                            <div className="flex flex-wrap gap-4 items-center">
                                {renderFilters()}
                                {Object.keys(filters).length > 0 && (
                                    <button 
                                        onClick={clearFilters}
                                        className="bg-red-600/20 text-red-300 px-3 py-1 
                                            rounded-full text-sm hover:bg-red-600/30"
                                    >
                                        Clear All Filters
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

					{/* Results Grid */}
					<div className="container mx-auto px-4 py-8 max-w-7xl">
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
							{searchResults.map((result) => {
								if (!result.poster_path && !result.profile_path) return null;

								return (
									<div 
										key={result.id} 
										className="bg-slate-900/60 rounded-xl overflow-hidden 
											border border-slate-800/50 shadow-lg 
											hover:scale-105 hover:shadow-xl 
											hover:shadow-blue-500/20 transition-all duration-300 group"
										onMouseEnter={() => setHoveredId(result.id)}
										onMouseLeave={() => setHoveredId(null)}
									>
										{activeTab === "person" ? (
											<Link 
												to={`/actor/${result.id}`} 
												className="block"
											>
												<div className="relative overflow-hidden">
													<img 
														src={ORIGINAL_IMG_BASE_URL + result.profile_path} 
														alt={result.name} 
														className="w-full h-auto object-cover 
															transition-transform group-hover:scale-110 
															group-hover:brightness-75"
													/>
													{hoveredId === result.id && (
														<div className="absolute inset-0 bg-black/30 
															flex items-center justify-center opacity-0
															group-hover:opacity-100 transition-opacity">
															<ArrowUpRight className="size-10 text-white" />
														</div>
													)}
												</div>
												<div className="p-4">
													<h2 className="text-lg font-semibold text-white
                                                group-hover:text-blue-300 transition-colors mb-2">{result.name}
													</h2>
													{renderKnownFor(result)}
												</div>
											</Link>
										) : (
											<Link
												to={`/${activeTab}/moreinfo/${result.id}`}
												onClick={() => setContentType(activeTab)}
												className="block"
											>
												<div className="relative overflow-hidden">
													<img
														src={ORIGINAL_IMG_BASE_URL + result.poster_path}
														alt={result.title || result.name}
														className="w-full h-auto object-cover 
															transition-transform group-hover:scale-110 
															group-hover:brightness-75"
													/>
													{hoveredId === result.id && (
														<div className="absolute inset-0 bg-black/30 
														flex items-center justify-center opacity-0 
														group-hover:opacity-100 transition-opacity">
															<ArrowUpRight className="size-8 text-white" />
														</div>
													)}
												</div>
												<div className="p-4">
													<h2 className="text-lg font-semibold text-white
														group-hover:text-blue-300 transition-colors mb-1">
														{result.title || result.name}
													</h2>
													{activeTab === 'tv' && result.first_air_date && (
														<p className="text-sm text-slate-400">
															First Aired: {formatDate(result.first_air_date)}
														</p>
													)}
													{activeTab === 'movie' && result.release_date && (
														<p className="text-sm text-slate-400">
															Released: {formatDate(result.release_date)}
														</p>
													)}
												</div>
											</Link>
										)}
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
        </div>
    );
};

export default SearchPage;
import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useContentStore } from "../store/content";
import Navbar from "../components/Navbar";
import { Search } from "lucide-react";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import { fetchSearchResults } from "../utils/searchUtils";

export const SearchPage = () => {
	const { search } = useLocation();
	const navigate = useNavigate();

	const [activeTab, setActiveTab] = useState("movie");
	const [searchTerm, setSearchTerm] = useState("");
	const { setSearchResults, setContentType, searchResults } = useContentStore();

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

	// Handle tab click and update the active tab
	const handleTabClick = (tab) => {
		setActiveTab(tab);
		setContentType(tab);  // Update the content type in store
		setSearchTerm("");  // Clear search term when changing tabs
		setSearchResults([]);  // Clear previous search results

		// Update the URL without reloading the page
		navigate(`?tab=${tab}`, { replace: true });
	};

	// Handle search form submission
	const handleSearch = async (e) => {
		e.preventDefault();
		const results = await fetchSearchResults(activeTab, searchTerm);
		setSearchResults(results);
	};

	return (
		<div className="bg-black min-h-screen text-white">
			<Navbar />
			<div className="container mx-auto px-4 py-8">
				<div className="flex justify-center gap-3 mb-4">
					<button className={`py-2 px-4 rounded ${activeTab === "movie" ? "bg-red-600" : "bg-gray-800"} hover:bg-red-700`}
						onClick={() => handleTabClick("movie")}>
						Movies
					</button>
					<button className={`py-2 px-4 rounded ${activeTab === "tv" ? "bg-red-600" : "bg-gray-800"} hover:bg-red-700`}
						onClick={() => handleTabClick("tv")}>
						TV Shows
					</button>
					<button className={`py-2 px-4 rounded ${activeTab === "person" ? "bg-red-600" : "bg-gray-800"} hover:bg-red-700`}
						onClick={() => handleTabClick("person")}>
						Person
					</button>
				</div>

				<form className="flex gap-2 items-stretch mb-8 max-w-2xl mx-auto" onSubmit={handleSearch}>
					<input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
						placeholder={"Search for a " + activeTab} className="w-full p-2 rounded bg-gray-800 text-white"
					/>
					<button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded">
						<Search className="size-6" />
					</button>
				</form>

				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{searchResults.map((result) => {
						if (!result.poster_path && !result.profile_path) return null;

						return (
							<div key={result.id} className="bg-gray-800 p-4 rounded">
								{activeTab === "person" ? (
									<Link to={`/actor/${result.id}`} state={{ knownFor: result.known_for }} className="flex flex-col items-center">
										<img src={ORIGINAL_IMG_BASE_URL + result.profile_path} alt={result.name} className="max-h-96 rounded mx-auto" />
										<h2 className="mt-2 text-xl font-bold">{result.name}</h2>
									</Link>
								) : (
									<Link
										to={"/watch/" + result.id}
										onClick={() => {
											setContentType(activeTab);
										}}
									>
										<img
											src={ORIGINAL_IMG_BASE_URL + result.poster_path}
											alt={result.title || result.name}
											className="w-full h-auto rounded"
										/>
										<h2 className="mt-2 text-xl font-bold">{result.title || result.name}</h2>
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
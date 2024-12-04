import axios from "axios";
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { SMALL_IMG_BASE_URL } from "../utils/constants";
import { Trash, ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { useContentStore } from "../store/content";
import HistoryPageSkeleton from "../components/skeletons/HistoryLoading.jsx";
import { formatDate } from "../utils/historyUtils";

export const HistoryPage = () => {
    const [searchHistory, setSearchHistory] = useState([]);
    const [sortOrder, setSortOrder] = useState('asc'); // for title or date sorting
    const [filterCategory, setFilterCategory] = useState('all'); // for filtering by searchType
    const [showDeleteModal, setShowDeleteModal] = useState(false); // for delete modal visibility
    const [hoveredId, setHoveredId] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState({ sort: false, filter: false });
    const { setContentTypeFromPath } = useContentStore();

    const [isLoading, setIsLoading] = useState(true);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 9;
    
    const uniqueCategories = ["all", ...new Set(searchHistory.map(entry => entry.searchType))];

    const sortOptions = [
        { value: 'title-asc', label: 'Name Ascending' },
        { value: 'title-desc', label: 'Name Descending' },
        { value: 'date-asc', label: 'Date (Oldest)' },
        { value: 'date-desc', label: 'Date (Newest)' }
    ];

    useEffect(() => {
        const getSearchHistory = async () => {
            try {
                setIsLoading(true);
                const res = await axios.get(`/api/v1/search/history`);
                const historyData = res.data.content;
                
                const uniqueHistoryData = historyData.filter(
                    (entry, index, self) => 
                        index === self.findIndex((e) => e.id === entry.id)
                );

                setSearchHistory(uniqueHistoryData);
            } catch (error) {
                console.log(error.message);
                setSearchHistory([]);
            } finally {
                setIsLoading(false);
            }
        }
        getSearchHistory();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown-sort')) {
                setIsDropdownOpen(prev => ({ ...prev, sort: false }));
            }
            if (!event.target.closest('.dropdown-filter')) {
                setIsDropdownOpen(prev => ({ ...prev, filter: false }));
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleDelete = async (entry, suppressToast = false) => {
        try {
            await axios.delete(`/api/v1/search/history/${entry.id}`);
            // console.log("test: ", entry)
            setSearchHistory((prevHistory) => prevHistory.filter((item) => item.id !== entry.id));
            if (!suppressToast) {
                toast.success(`Deleted ${entry.title}`);
            }
        } catch (error) {
            if (!suppressToast) {
                toast.error("Failed to delete search item");
            }
            console.log(error);
        }
    };

    const getEntryPath = (entry) => {
        switch (entry.searchType) {
            case 'movie':
                return `/movie/moreinfo/${entry.id}`;
            case 'tv':
                return `/tv/moreinfo/${entry.id}`;
            case 'person':
                return `/actor/${entry.id}`;
            case 'collection':
                return `/collection/${entry.id}`;
            default:
                return '/';
        }
    };

    const handleDeleteAll = async () => {
        try {
            for (const entry of searchHistory) {
                await handleDelete(entry, true);
            }
            toast.success("All search history deleted");
            setShowDeleteModal(false);
        } catch (error) {
            toast.error("Failed to delete all search items");
            console.log(error);
        }
    };

    // eslint-disable-next-line react/prop-types
    const DeleteModal = ({ showModal, onClose, onDelete }) => {
        if (!showModal) return null;
    
        return (
            <div className="fixed inset-0 flex justify-center items-center bg-black/70 backdrop-blur-sm z-10">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 max-w-md w-full mx-4">
                    <h2 className="text-xl mb-6 text-white font-semibold">Are you sure you want to delete all search history?</h2>
                    <div className="flex justify-end gap-3">
                        <button 
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors" 
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button 
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors" 
                            onClick={onDelete}
                        >
                            Delete All
                        </button>
                    </div>
                </div>
            </div>
        );
    };  

    const filteredAndSortedHistory = searchHistory
    .filter(entry => filterCategory === 'all' || entry.searchType === filterCategory)
    .sort((a, b) => {
        if (sortOrder === 'title-asc') {
            return a.title.localeCompare(b.title);
        } else if (sortOrder === 'title-desc') {
            return b.title.localeCompare(a.title);
        } else if (sortOrder === 'date-asc') {
            return new Date(a.createdAt) - new Date(b.createdAt);
        } else if (sortOrder === 'date-desc') {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
    });

    const totalPages = Math.ceil(filteredAndSortedHistory.length / ITEMS_PER_PAGE);
    const paginatedHistory = filteredAndSortedHistory.slice(
        (currentPage - 1) * ITEMS_PER_PAGE, 
        currentPage * ITEMS_PER_PAGE
    );

    if (isLoading) { return <HistoryPageSkeleton/>}

    if(searchHistory?.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
                <Navbar/>
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-8">Search History</h1>
                    <div className="flex justify-center items-center h-96">
                        <p className="text-xl text-slate-300">Your search history is empty</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Search History</h1>
    
                {/* Controls */}
                <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Sort Dropdown */}
                        <div className="dropdown-sort relative min-w-[200px]">
                            <button
                                className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-700 text-white 
                                    rounded-lg px-4 py-2.5 text-left flex items-center justify-between
                                    hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 
                                    focus:ring-blue-500"
                                onClick={() => setIsDropdownOpen(prev => ({ 
                                    ...prev, 
                                    sort: !prev.sort 
                                }))}
                            >
                                <span>{sortOptions.find(opt => opt.value === sortOrder)?.label}</span>
                                <ChevronDown className={`size-5 transition-transform duration-200 
                                    ${isDropdownOpen.sort ? 'rotate-180' : ''}`}
                                />
                            </button>
                            {isDropdownOpen.sort && (
                                <div className="absolute z-10 w-full mt-2 rounded-lg bg-slate-800 border 
                                    border-slate-700 shadow-lg shadow-black/20 backdrop-blur-sm">
                                    {sortOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            className={`w-full px-4 py-2.5 text-left hover:bg-blue-600/20 
                                                transition-colors first:rounded-t-lg last:rounded-b-lg
                                                ${sortOrder === option.value 
                                                    ? 'bg-blue-600/20 text-blue-200' 
                                                    : 'text-slate-200'}`}
                                            onClick={() => {
                                                setSortOrder(option.value);
                                                setIsDropdownOpen(prev => ({ ...prev, sort: false }));
                                            }}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Filter Dropdown */}
                        <div className="dropdown-filter relative min-w-[160px]">
                            <button
                                className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-700 text-white 
                                    rounded-lg px-4 py-2.5 text-left flex items-center justify-between
                                    hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 
                                    focus:ring-blue-500"
                                onClick={() => setIsDropdownOpen(prev => ({ 
                                    ...prev, 
                                    filter: !prev.filter 
                                }))}
                            >
                                <span>
                                    {filterCategory === 'all' 
                                        ? 'All Categories' 
                                        : filterCategory.charAt(0).toUpperCase() + filterCategory.slice(1)}
                                </span>
                                <ChevronDown className={`size-5 transition-transform duration-200 
                                    ${isDropdownOpen.filter ? 'rotate-180' : ''}`}
                                />
                            </button>
                            {isDropdownOpen.filter && (
                                <div className="absolute z-10 w-full mt-2 rounded-lg bg-slate-800 border 
                                    border-slate-700 shadow-lg shadow-black/20 backdrop-blur-sm">
                                    {uniqueCategories.map((category) => (
                                        <button
                                            key={category}
                                            className={`w-full px-4 py-2.5 text-left hover:bg-blue-600/20 
                                                transition-colors first:rounded-t-lg last:rounded-b-lg
                                                ${filterCategory === category 
                                                    ? 'bg-blue-600/20 text-blue-200' 
                                                    : 'text-slate-200'}`}
                                            onClick={() => {
                                                setFilterCategory(category);
                                                setIsDropdownOpen(prev => ({ ...prev, filter: false }));
                                            }}
                                        >
                                            {category === 'all' 
                                                ? 'All Categories' 
                                                : category.charAt(0).toUpperCase() + category.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Delete All Button */}
                    <button 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg 
                            transition-colors shadow-lg shadow-blue-500/30"
                        onClick={() => setShowDeleteModal(true)}
                    >
                        Delete All
                    </button>
                </div>
    
                {/* History Items Grid */}
                <div className="relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedHistory.map((entry) => (
                            <div 
                                key={entry.id} 
                                className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-4 border border-slate-800 
                                    transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 group"
                                onMouseEnter={() => setHoveredId(entry.id)}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                <Link 
                                    to={getEntryPath(entry)}
                                    onClick={() => setContentTypeFromPath(getEntryPath(entry))}
                                    className="flex items-start gap-4"
                                >
                                    <div className="relative">
                                        <img
                                            src={SMALL_IMG_BASE_URL + entry.image}
                                            alt={entry.title}
                                            className="size-16 rounded-lg object-cover transition-all duration-300 
                                                group-hover:brightness-75"
                                        />
                                        {hoveredId === entry.id && (
                                            <div className="absolute inset-0 flex items-center justify-center 
                                                bg-black/30 rounded-lg transition-opacity duration-300">
                                                <ArrowUpRight className="size-5 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 
                                            transition-colors line-clamp-1">
                                            {entry.title}
                                        </h3>
                                        <p className="text-slate-400 text-sm">{formatDate(entry.createdAt)}</p>
                                        
                                        <span className={`inline-block mt-2 py-1 px-3 rounded-full text-sm 
                                            ${entry.searchType === 'movie'
                                                ? 'bg-blue-600/20 text-blue-300 border border-blue-500/20'
                                                : entry.searchType === 'tv'
                                                ?'bg-purple-600/20 text-purple-300 border border-purple-500/20'
                                                : entry.searchType === 'person' ? 'bg-green-600/20 text-green-300 border border-green-500/20' 
                                                : 'bg-red-600/20 text-red-300 border border-red-500/20'
                                            }`}
                                        >
                                            {entry.searchType.charAt(0).toUpperCase() + entry.searchType.slice(1)}
                                        </span>
                                    </div>
                                </Link>

                                <button 
                                    className="absolute top-4 right-4"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleDelete(entry);
                                    }}
                                >
                                    <Trash className="size-5 text-slate-400 hover:text-blue-400 transition-colors" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-4 py-4 mt-7">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft />
                            </button>
                            <span>{currentPage} / {totalPages}</span>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight />
                            </button>
                        </div>
                    )}

            </div>
    
            {/* Delete Modal */}
            <DeleteModal
                showModal={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onDelete={handleDeleteAll}
            />
        </div>
    ); 

}

export default HistoryPage;
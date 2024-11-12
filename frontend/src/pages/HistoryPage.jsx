import axios from "axios";
import { useEffect, useState } from "react"
import Navbar from "../components/Navbar";
import { SMALL_IMG_BASE_URL } from "../utils/constants";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";

function formatDate(dateString) {
    const date = new Date(dateString);

    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const month = monthNames[date.getUTCMonth()];
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();

    return `${month} ${day}, ${year}`;
}

export const HistoryPage = () => {
    const [searchHistory, setSearchHistory] = useState([]);
    const [sortOrder, setSortOrder] = useState('asc'); // for title or date sorting
    const [filterCategory, setFilterCategory] = useState('all'); // for filtering by searchType
    const [showDeleteModal, setShowDeleteModal] = useState(false); // for delete modal visibility
    const uniqueCategories = ["all", ...new Set(searchHistory.map(entry => entry.searchType))];

    useEffect(() => {
        const getSearchHistory = async () => {
            try {
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
            }
        }
        getSearchHistory();
    }, []);

    const handleDelete = async (entry, suppressToast = false) => {
        try {
            await axios.delete(`/api/v1/search/history/${entry.id}`);
            console.log("test: ", entry)
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

    const handleSortChange = (type) => {
        setSortOrder(type);
    };
    
    const handleFilterChange = (category) => {
        setFilterCategory(category);
    };
    
    const handleDeleteAll = async () => {
        try {
            for (const entry of searchHistory) {
                await handleDelete(entry, true); // Pass true to suppress toast notifications
            }
            toast.success("All search history deleted");
            setShowDeleteModal(false); // Close the modal after deletion
        } catch (error) {
            toast.error("Failed to delete all search items");
            console.log(error);
        }
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

    // eslint-disable-next-line react/prop-types
    const DeleteModal = ({ showModal, onClose, onDelete }) => {
        if (!showModal) return null;
    
        return (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10">
                <div className="bg-white p-6 rounded">
                    <h2 className="text-xl mb-4 text-black">Are you sure you want to delete all search history?</h2>
                    <div className="flex justify-end">
                        <button className="px-4 py-2 bg-gray-500 text-white rounded mr-2" onClick={onClose}>No</button>
                        <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={onDelete}>Yes</button>
                    </div>
                </div>
            </div>
        );
    };  

    if(searchHistory?.length === 0) {
        return (
            <div className="bg-black min-h-screen text-white">
                <Navbar/>
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-8">Search History</h1>
                    <div className="flex justify-center items-center h-96">
                        <p className="text-xl">Your search history is empty</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-black text-white min-h-screen">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Search History</h1>
    
                {/* Sorting and Filtering Buttons */}
                <div className="mb-4 grid grid-cols-3 gap-4 items-center">
                    <select className="bg-gray-700 text-white px-4 py-2 rounded mr-4"
                    onChange={(e) => handleSortChange(e.target.value)}
                    value={sortOrder}>
                        <option value="title-asc">Sort by Name (Asc)</option>
                        <option value="title-desc">Sort by Name (Desc)</option>
                        <option value="date-asc">Sort by Date (Asc)</option>
                        <option value="date-desc">Sort by Date (Desc)</option>
                    </select>

                    <select className="bg-gray-700 text-white px-4 py-2 rounded ml-4"
                    onChange={(e) => handleFilterChange(e.target.value)}
                    value={filterCategory}>
                        {uniqueCategories.map((category) => (
                            <option key={category} value={category}>
                                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                            </option>
                        ))}
                    </select>

                    {/* Delete All Button */}
                    <div className="flex justify-end">
                        <button className="bg-red-600 text-white px-4 py-2 rounded"
                        onClick={() => setShowDeleteModal(true)}>
                            Delete All
                        </button>
                    </div>
                </div>
    
                {/* History Items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    {filteredAndSortedHistory.map((entry) => (
                        <div key={entry.id} className="bg-gray-800 p-4 rounded flex items-start">
                            <img
                                src={SMALL_IMG_BASE_URL + entry.image}
                                alt="History image"
                                className="size-16 rounded-full object-cover mr-4"
                            />
                            <div className="flex flex-col">
                                <span className="text-white text-lg">{entry.title}</span>
                                <span className="text-gray-400 text-sm">{formatDate(entry.createdAt)}</span>
                            </div>
                            <span
                                className={`py-1 px-3 min-w-20 text-center rounded-full text-sm ml-auto ${
                                    entry.searchType === 'movie'
                                        ? 'bg-red-600'
                                        : entry.searchType === 'tv'
                                        ? 'bg-blue-600'
                                        : 'bg-green-600'
                                }`}
                            >
                                {entry.searchType[0].toUpperCase() + entry.searchType.slice(1)}
                            </span>
                            <Trash
                                className="size-5 ml-4 cursor-pointer hover:fill-red-600 hover:text-red-600"
                                onClick={() => handleDelete(entry)}
                            />
                        </div>
                    ))}
                </div>
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

export default HistoryPage
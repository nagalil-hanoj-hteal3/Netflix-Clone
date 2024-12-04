/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SMALL_IMG_BASE_URL } from "../utils/constants";
import toast from "react-hot-toast";
import { Film, Tv2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useContentStore } from "../store/content";
import BookmarkSkeleton from "../components/skeletons/BookmarkSkeleton";

function BookmarksPage() {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Pagination states
    const [currentMoviePage, setCurrentMoviePage] = useState(1);
    const [currentTvPage, setCurrentTvPage] = useState(1);
    const ITEMS_PER_PAGE = 6;

    const {setContentTypeFromPath} = useContentStore();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const response = await axios.get('/api/v1/bookmark');
                setBookmarks(response.data.bookmarks);
                setLoading(false);
            } catch (err) {
                console.log(err);
                setError('Failed to fetch bookmarks');
                setLoading(false);
            }
        };

        fetchBookmarks();
    }, []);

    const handleRemoveBookmark = async (contentId, title) => {
        try {
            await axios.delete(`/api/v1/bookmark/remove/${contentId}`);
            setBookmarks(prev => prev.filter(bookmark => bookmark.contentId !== contentId));
            toast.success(`Successfully removed ${title}!`);
        } catch (err) {
            console.log(err);
            setError('Failed to remove bookmark');
        }
    };

    const handleLinkClick = (contentId, contentType) => {
      setContentTypeFromPath(`/${contentType}/${contentId}`);
      navigate(`/watch/${contentId}`);
    };

    // Pagination helper functions
    const paginateArray = (array, currentPage) => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return array.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    };

    const handleMoviePageChange = (newPage) => {
        setCurrentMoviePage(newPage);
    };

    const handleTvPageChange = (newPage) => {
        setCurrentTvPage(newPage);
    };

    if (loading) return <BookmarkSkeleton/>;
    if (error) return <div>{error}</div>;

    const movieBookmarks = bookmarks.filter(b => b.contentType === 'movie');
    const tvBookmarks = bookmarks.filter(b => b.contentType === 'tv');

    // Paginated bookmarks
    const paginatedMovieBookmarks = paginateArray(movieBookmarks, currentMoviePage);
    const paginatedTvBookmarks = paginateArray(tvBookmarks, currentTvPage);

    // Pagination component
    const PaginationControls = ({ 
        totalItems, 
        currentPage, 
        itemsPerPage, 
        onPageChange 
    }) => {
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        return (
            <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center space-x-4 py-2">
                <button 
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft />
                </button>
                <span>{currentPage} / {totalPages || 1}</span>
                <button 
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronRight />
                </button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white">
            <Navbar/>
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold mb-8">My Bookmarks</h1>
                
                {bookmarks.length === 0 ? (
                    <p className="text-gray-400">No bookmarks available</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Movies Section */}
                        <div className="relative min-h-[420px]">
                            <div className="flex items-center mb-4">
                                <Film className="mr-2 text-red-400" />
                                <h2 className="text-2xl font-semibold">Movies ({movieBookmarks.length})</h2>
                            </div>
                            {movieBookmarks.length > 0 ? (
                                <div className="grid grid-cols-3 gap-4 pb-10">
                                    {paginatedMovieBookmarks.map((bookmark) => (
                                        <div key={bookmark?.contentId} className="relative group">
                                            <div 
                                              onClick={() => handleLinkClick(bookmark.contentId, 'movie')}
                                              className="cursor-pointer">
                                                <img 
                                                    src={`${SMALL_IMG_BASE_URL}${bookmark?.posterPath}`} 
                                                    alt={bookmark?.title}
                                                    className="w-full h-48 object-cover rounded-lg shadow-lg 
                                                    transition-transform duration-300 group-hover:scale-105"
                                                />
                                                <h3 className="mt-2 text-lg font-semibold truncate">{bookmark?.title}</h3>
                                            </div>
                                            <button 
                                                onClick={() => handleRemoveBookmark(bookmark?.contentId, bookmark?.title)}
                                                className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 
                                                text-white p-2 rounded-full opacity-0 group-hover:opacity-100 
                                                transition-opacity duration-300"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400">No movie bookmarks</p>
                            )}
                            
                            {movieBookmarks.length > ITEMS_PER_PAGE && (
                                <PaginationControls 
                                    totalItems={movieBookmarks.length}
                                    currentPage={currentMoviePage}
                                    itemsPerPage={ITEMS_PER_PAGE}
                                    onPageChange={handleMoviePageChange}
                                />
                            )}
                        </div>

                        {/* TV Shows Section */}
                        <div className="relative min-h-[420px]">
                            <div className="flex items-center mb-4">
                                <Tv2 className="mr-2 text-blue-400" />
                                <h2 className="text-2xl font-semibold">TV Shows ({tvBookmarks.length})</h2>
                            </div>
                            {tvBookmarks.length > 0 ? (
                                <div className="grid grid-cols-3 gap-4 pb-10">
                                    {paginatedTvBookmarks.map((bookmark) => (
                                        <div key={bookmark.contentId} className="relative group">
                                            <div onClick={() => handleLinkClick(bookmark.contentId, 'tv')}
                                                className="cursor-pointer">
                                                <img 
                                                    src={`${SMALL_IMG_BASE_URL}${bookmark.posterPath}`} 
                                                    alt={bookmark.title}
                                                    className="w-full h-48 object-cover rounded-lg shadow-lg 
                                                    transition-transform duration-300 group-hover:scale-105"
                                                />
                                                <h3 className="mt-2 text-lg font-semibold truncate">{bookmark.title}</h3>
                                            </div>
                                            <button 
                                                onClick={() => handleRemoveBookmark(bookmark.contentId, bookmark.title)}
                                                className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 
                                                text-white p-2 rounded-full opacity-0 group-hover:opacity-100 
                                                transition-opacity duration-300"
                                                aria-label="Remove bookmark"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400">No TV show bookmarks</p>
                            )}
                            
                            {tvBookmarks.length > ITEMS_PER_PAGE && (
                                <PaginationControls 
                                    totalItems={tvBookmarks.length}
                                    currentPage={currentTvPage}
                                    itemsPerPage={ITEMS_PER_PAGE}
                                    onPageChange={handleTvPageChange}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default BookmarksPage;
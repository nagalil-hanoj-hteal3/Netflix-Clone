import { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SMALL_IMG_BASE_URL } from "../utils/constants";
import toast from "react-hot-toast";
import { Film, Tv2, Trash2 } from 'lucide-react';
import { useContentStore } from "../store/content";

const BookmarkSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">My Bookmarks</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Movies Skeleton */}
          <div>
            <div className="flex items-center mb-4">
              <Film className="mr-2" />
              <h2 className="text-2xl font-semibold">Movies</h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-slate-700 h-48 w-full rounded-lg mb-2"></div>
                  <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
          
          {/* TV Shows Skeleton */}
          <div>
            <div className="flex items-center mb-4">
              <Tv2 className="mr-2" />
              <h2 className="text-2xl font-semibold">TV Shows</h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-slate-700 h-48 w-full rounded-lg mb-2"></div>
                  <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function BookmarksPage() {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
      // Set the content type based on the bookmark's content type
      setContentTypeFromPath(`/${contentType}/${contentId}`);
      navigate(`/watch/${contentId}`);
    };

    if (loading) return <BookmarkSkeleton/>;
    if (error) return <div>{error}</div>;

    const movieBookmarks = bookmarks.filter(b => b.contentType === 'movie');
    const tvBookmarks = bookmarks.filter(b => b.contentType === 'tv');

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
                        <div>
                            <div className="flex items-center mb-4">
                                <Film className="mr-2 text-red-400" />
                                <h2 className="text-2xl font-semibold">Movies ({movieBookmarks.length})</h2>
                            </div>
                            {movieBookmarks?.length > 0 ? (
                                <div className="grid grid-cols-3 gap-4">
                                    {movieBookmarks.map((bookmark) => (
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
                        </div>

                        {/* TV Shows Section */}
                        <div>
                            <div className="flex items-center mb-4">
                                <Tv2 className="mr-2 text-blue-400" />
                                <h2 className="text-2xl font-semibold">TV Shows ({tvBookmarks.length})</h2>
                            </div>
                            {tvBookmarks.length > 0 ? (
                                <div className="grid grid-cols-3 gap-4">
                                    {tvBookmarks.map((bookmark) => (
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
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default BookmarksPage;
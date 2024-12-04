import Navbar from "../Navbar";
import { Film, Tv2 } from 'lucide-react';

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

export default BookmarkSkeleton;
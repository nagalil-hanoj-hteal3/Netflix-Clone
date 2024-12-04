import { motion } from 'framer-motion';

const HistoryItemSkeleton = () => {
    return (
        <motion.div 
            initial={{ opacity: 0.6 }}
            animate={{ 
                opacity: [0.6, 0.8, 0.6],
                transition: { 
                    duration: 1.5, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                }
            }}
            className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-4 border border-slate-800 
                animate-pulse relative overflow-hidden"
        >
            <div className="flex items-start gap-4">
                {/* Image Skeleton */}
                <div className="size-16 rounded-lg bg-slate-700/50 animate-pulse"></div>
                
                <div className="flex-1 space-y-3">
                    {/* Title Skeleton */}
                    <div className="h-5 bg-slate-700/50 rounded w-3/4 animate-pulse"></div>
                    
                    {/* Date Skeleton */}
                    <div className="h-4 bg-slate-700/50 rounded w-1/2 animate-pulse"></div>
                    
                    {/* Category Skeleton */}
                    <div className="h-6 bg-slate-700/50 rounded-full w-1/3 animate-pulse"></div>
                </div>
            </div>

            {/* Delete Icon Skeleton */}
            <div className="absolute top-4 right-4 size-5 bg-slate-700/50 rounded animate-pulse"></div>
        </motion.div>
    );
};

const HistoryPageSkeleton = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="h-10 bg-slate-800 rounded w-1/3 mb-8 animate-pulse"></div>
                
                <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Dropdown Skeletons */}
                        <div className="h-10 bg-slate-800 rounded w-[200px]"></div>
                        <div className="h-10 bg-slate-800 rounded w-[160px]"></div>
                    </div>
                    <div className="h-10 bg-slate-800 rounded w-32"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                        <HistoryItemSkeleton key={index} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HistoryPageSkeleton;
export const WatchPageSkeleton = () => {
  return (
    <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-blue-950 text-white min-h-screen">
      {/* Navbar Placeholder */}
      <div className="h-16 bg-slate-800/50 mb-8"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-20 space-y-8">
        {/* Header Section */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 animate-pulse">
          {/* Poster/Image Placeholder */}
          <div className="bg-slate-800 rounded-lg w-full aspect-[2/3] shimmer"></div>
          
          {/* Details Placeholder */}
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-md h-12 w-3/4 shimmer"></div>
            <div className="bg-slate-800 rounded-md h-6 w-1/2 shimmer"></div>
            
            <div className="space-y-4 mt-6">
              {[1, 2, 3].map((_, index) => (
                <div 
                  key={index} 
                  className="bg-slate-800 rounded-md h-4 w-full shimmer"
                ></div>
              ))}
            </div>

            <div className="flex space-x-4 mt-8">
              <div className="bg-slate-800 rounded-full h-12 w-32 shimmer"></div>
              <div className="bg-slate-800 rounded-full h-12 w-32 shimmer"></div>
            </div>
          </div>
        </div>

        {/* Similar Content Section */}
        <div className="space-y-6 animate-pulse">
          <div className="bg-slate-800 rounded-md h-8 w-1/3 shimmer"></div>
          <div className="flex overflow-x-scroll gap-6 p-4">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 w-64 h-96 bg-slate-800 rounded-lg shimmer"
              ></div>
            ))}
          </div>
        </div>

        {/* Additional Content Sections */}
        <div className="space-y-6 animate-pulse">
          <div className="bg-slate-800 rounded-md h-8 w-1/3 shimmer"></div>
          <div className="bg-slate-800 rounded-md h-24 w-full shimmer"></div>
        </div>
      </div>
    </div>
  );
}

export default WatchPageSkeleton;
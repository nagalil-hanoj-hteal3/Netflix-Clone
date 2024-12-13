/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import { SMALL_IMG_BASE_URL } from "../../utils/constants";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const RecommendationsSection = ({ 
    recommendations, 
    recommendationsSliderRef, 
    canScrollStates, 
    scroll 
}) => {
    const renderScrollButtons = () => (
        <>
            {canScrollStates.recommendations?.left && (
                <button
                    onClick={() => scroll('left', recommendationsSliderRef, 'recommendations')}
                    className="absolute left-0 top-1/3 -translate-y-1/2 p-3 
                            bg-blue-600/90 hover:bg-blue-500 backdrop-blur rounded-full 
                            transition-all duration-300 opacity-0 group-hover:opacity-100
                            shadow-lg hover:shadow-blue-500/50 transform hover:-translate-x-1"
                >
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>
            )}
            {canScrollStates.recommendations?.right && (
                <button
                    onClick={() => scroll('right', recommendationsSliderRef, 'recommendations')}
                    className="absolute right-0 top-1/3 -translate-y-1/2 p-3 
                            bg-blue-600/90 hover:bg-blue-500 backdrop-blur rounded-full 
                            transition-all duration-300 opacity-0 group-hover:opacity-100
                            shadow-lg hover:shadow-blue-500/50 transform hover:translate-x-1"
                >
                    <ChevronRight className="w-6 h-6 text-white" />
                </button>
            )}
        </>
    );

    // Only render if there are recommendations with poster paths
    if (!recommendations?.some(item => item?.poster_path)) {
        return null;
    }

    return (
        <div className="mb-12">
            <h3 className="text-3xl font-bold mb-6">Recommended for You</h3>
            <div className="relative group">
                <div 
                    className="flex overflow-x-scroll scrollbar-hide gap-4 pb-4" 
                    ref={recommendationsSliderRef}
                >
                    {recommendations?.map((item) =>
                        item?.poster_path ? (
                            <Link 
                                key={item.id} 
                                to={`/watch/${item.id}`} 
                                className="w-52 flex-none hover:text-red-300"
                            >
                                <img
                                    loading="lazy"
                                    src={`${SMALL_IMG_BASE_URL}${item.poster_path}`}
                                    alt="Recommendation Poster"
                                    className="w-full h-auto transition-transform duration-300 ease-in-out hover:scale-105"
                                />
                                <h4 className="mt-2 text-lg font-semibold">{item.title || item.name}</h4>
                            </Link>
                        ) : null
                    )}
                </div>
                {renderScrollButtons()}
            </div>
        </div>
    );
};

export default RecommendationsSection;
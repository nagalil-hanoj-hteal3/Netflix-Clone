/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SMALL_IMG_BASE_URL } from "../../utils/constants";

const SimilarContent = ({ 
    similarContent, 
    contentType, 
    similarSliderRef, 
    canScrollStates, 
    scroll 
}) => {
    const renderScrollButtons = () => (
        <>
            {canScrollStates?.similar?.left && (
                <button
                    onClick={() => scroll('left', similarSliderRef, 'similar')}
                    className="absolute left-0 top-1/3 -translate-y-1/2 p-3 
                            bg-blue-600/90 hover:bg-blue-500 backdrop-blur rounded-full 
                            transition-all duration-300 opacity-0 group-hover:opacity-100
                            shadow-lg hover:shadow-blue-500/50 transform hover:-translate-x-1"
                >
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>
            )}
            {canScrollStates?.similar?.right && (
                <button
                    onClick={() => scroll('right', similarSliderRef, 'similar')}
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

    if (!similarContent?.length) return null;

    return (
        <div className="mb-12">
            <h3 className="text-3xl font-bold mb-6">
                Similar {contentType === "tv" 
                    ? contentType.charAt(0).toUpperCase() + contentType.charAt(1).toUpperCase() + contentType.slice(2) 
                    : contentType.charAt(0).toUpperCase() + contentType.slice(1)}
            </h3>
            <div className="relative group">
                <div 
                    className="flex overflow-x-scroll scrollbar-hide gap-4 pb-4" 
                    ref={similarSliderRef}
                >
                    {similarContent?.map((content) => content?.poster_path ? (
                        <Link 
                            key={content?.id} 
                            to={`/watch/${content?.id}`}
                            className="w-52 flex-none hover:text-red-300"
                        >
                            <img 
                                loading="lazy" 
                                src={SMALL_IMG_BASE_URL + content?.poster_path} 
                                alt="Similar Poster path"
                                className="w-full h-auto transition-transform duration-300 ease-in-out hover:scale-105"
                            />
                            <h4 className="mt-2 text-lg font-semibold">
                                {content?.title || content?.name}
                            </h4>
                        </Link>
                    ) : null)}
                    {renderScrollButtons()}
                </div>
            </div>
        </div>
    );
};

export default SimilarContent;
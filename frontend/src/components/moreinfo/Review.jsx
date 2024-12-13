/* eslint-disable react/prop-types */
import { useState } from 'react';
import { ChevronLeft, ChevronRight, User } from "lucide-react";
import StarRating from "../../components/StarRating";

const ReviewSection = ({ reviewContent, reviewersSliderRef }) => {
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
    const [expandedIndex, setExpandedIndex] = useState(null);

    const goToNextReview = () => {
        if(currentReviewIndex < reviewContent?.total_results - 1){
            setCurrentReviewIndex(prev => prev + 1);
            setExpandedIndex(null);
        }
    };

    const goToPrevReview = () => {
        if (currentReviewIndex > 0){
            setCurrentReviewIndex(prev => prev - 1);
            setExpandedIndex(null);
        }
    };

    const toggleContent = (index) => {
        setExpandedIndex(prevIndex => prevIndex === index ? null : index);
    };

    // If no reviews are available
    if (!reviewContent || reviewContent.results.length === 0) {
        return (
            <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Reviews</h2>
                <p className="text-white italic">No reviews available at this time.</p>
            </div>
        );
    }

    const currentReview = reviewContent.results[currentReviewIndex];

    return (
        <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Reviews</h2>
            <div className="bg-slate-800/50 rounded-xl p-6">
                <div className="flex items-center justify-between w-full">
                    {/* Left Chevron */}
                    <div className={`w-12 flex-shrink-0 ${currentReviewIndex === 0 ? 'invisible' : 'visible'}`}>
                        <button
                            onClick={goToPrevReview}
                            className={`p-2 bg-black/50 rounded-full transition-all duration-300 transform hover:scale-110`}
                            disabled={currentReviewIndex === 0}
                        >
                            <ChevronLeft className="w-6 h-6 text-white" />
                        </button>
                    </div>

                    {/* Current Review */}
                    <div ref={reviewersSliderRef} className="flex-1 mx-4 min-h-[50vh]">
                        {/* Avatar and Username */} 
                        <div className="flex items-center justify-between w-full mb-4">
                            <div className="flex items-center">
                                {currentReview.author_details.avatar_path ? (
                                    <img
                                        loading="lazy"
                                        src={`https://image.tmdb.org/t/p/w200/${currentReview.author_details.avatar_path}`}
                                        alt={`${currentReview.author} Avatar`}
                                        className="w-20 h-20 rounded-full mr-4"
                                    />
                                ) : (
                                    <div 
                                        className="w-20 h-20 rounded-full mr-4 bg-gray-700 flex items-center justify-center"
                                    >
                                        <User className="w-10 h-10 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <span className="text-lg font-bold text-right">
                                {currentReview.author_details.username}
                            </span>
                        </div>

                        {/* Review Content */}
                        <p className="text-lg">
                            {expandedIndex === currentReviewIndex || currentReview.content.length <= 300
                                ? currentReview.content
                                : `${currentReview.content.slice(0, 300)}...`}
                            {currentReview.content.length > 300 && (
                                <button 
                                    onClick={() => toggleContent(currentReviewIndex)} 
                                    className="text-white hover:text-blue-600"
                                >
                                    {expandedIndex === currentReviewIndex ? `\u00A0See less` : `\u00A0See more`}
                                </button>
                            )}
                        </p>

                        {/* Date, Rating, and Review Counter */}
                        <div className="mt-4 flex items-center justify-between">
                            <p className="text-blue-200 text-sm">
                                {new Date(currentReview.created_at).toLocaleDateString()}
                                {" | Rated: "}
                                {currentReview.author_details.rating
                                    ? `${currentReview.author_details.rating}/10`
                                    : "N/A"
                                }
                            </p>
                            
                            {/* Review Counter */}
                            <span className="text-sm font-medium bg-blue-900/50 text-blue-200 px-3 py-1 rounded-full">
                                {currentReviewIndex + 1}/{reviewContent.results.length}
                            </span>
                        </div>

                        {/* Star Rating */}
                        {currentReview.author_details.rating && (
                            <div className="flex space-x-3 mt-2">
                                <StarRating
                                    rating={currentReview.author_details.rating / 2}
                                    maxStars={5}
                                    size="w-6 h-6"
                                />
                            </div>
                        )}
                    </div>

                    {/* Right Chevron */}
                    <div className={`w-12 flex-shrink-0 ${currentReviewIndex === reviewContent.results.length - 1 ? 'invisible' : 'visible'}`}>
                        <button
                            onClick={goToNextReview}
                            className={`p-2 bg-black/50 rounded-full transition-all duration-300 transform hover:scale-110`}
                            disabled={currentReviewIndex === reviewContent.results.length - 1}
                        >
                            <ChevronRight className="w-6 h-6 text-white" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewSection;
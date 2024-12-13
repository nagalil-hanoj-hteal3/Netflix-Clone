import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useContentStore } from "../store/content";
import Navbar from "../components/Navbar";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import Gallery from "../components/moreinfo/Gallery";
import CreativeLoadingScreen from "../components/skeletons/MoreInfoLoading"; 
import ContentHeader from "../components/moreinfo/ContentHeader";
import CastCrewSection from "../components/moreinfo/CastCrewSection";
import SimilarContent from "../components/moreinfo/SimilarContent";
import RecommendationsSection from "../components/moreinfo/RecommendationSection";
import ReviewSection from "../components/moreinfo/Review";

// Import the custom hook
import { useMoreInfoPage } from "../hooks/moreinfo/useMoreInfoPage";
import { useScrollManagement } from "../hooks/moreinfo/useScrollManagement";
import { useCastMemberFilter } from "../hooks/moreinfo/useCastMemberFilter";

function MoreInfoPage() {
    const { id } = useParams();
    const { contentType, setContentTypeFromPath } = useContentStore();
    const location = window.location.pathname;

    // Use custom hooks
    const {
        loading,
        content,
        similarContent,
        reviewContent,
        castMember,
        recommendations,
        contentImages,
        handleBookmark,
        isBookmarked
    } = useMoreInfoPage(id, contentType);

    // Refs for sliders
    const castSliderRef = useRef(null);
    const similarSliderRef = useRef(null);
    const recommendationsSliderRef = useRef(null);
    const reviewersSliderRef = useRef(null);

    // Scroll management hook
    const { canScrollStates, scroll } = useScrollManagement({
        castSliderRef,
        similarSliderRef,
        recommendationsSliderRef
    });

    // Cast member filtering
    const { 
        combinedMembers, 
        uniqueMembers, 
        filterRole, 
        setFilterRole 
    } = useCastMemberFilter(castMember);

    // Content type and scroll restoration effects
    useEffect(() => {
        setContentTypeFromPath(location);
        window.scrollTo(0, 0);
    }, [location, id, setContentTypeFromPath]);

    // Loading state
    if (loading) return (<CreativeLoadingScreen />);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white">
            <Navbar />
            <div className="relative min-h-screen">
                {/* Backdrop Image */}
                <div className="absolute inset-0 h-[90vh]">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                    {content?.backdrop_path && (
                        <img
                            src={`${ORIGINAL_IMG_BASE_URL}${content.backdrop_path}`}
                            alt="backdrop image"
                            className="w-full h-full object-cover opacity-30"
                        />
                    )}
                </div>
                
                {/* Content Container */}
                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
                    <ContentHeader
                        content={content}
                        id={id}
                        contentType={contentType}
                        uniqueMembers={uniqueMembers}
                        handleBookmark={handleBookmark}
                        isBookmarked={isBookmarked}
                    />

                    {/* Cast & Crew Section */}
                    {(combinedMembers?.length > 0) && (
                        <CastCrewSection
                            combinedMembers={combinedMembers}
                            castSliderRef={castSliderRef}
                            canScrollStates={canScrollStates}
                            uniqueMembers={uniqueMembers}
                            scroll={scroll}
                            filterRole={filterRole}
                            setFilterRole={setFilterRole}
                        />
                    )}

                    {/* Similar Content */}
                    {similarContent?.length > 0 && (
                        <SimilarContent
                            similarContent={similarContent}
                            contentType={contentType}
                            similarSliderRef={similarSliderRef}
                            canScrollStates={canScrollStates}
                            scroll={scroll}
                        />
                    )}

                    {/* Recommendations */}
                    {recommendations?.length > 0 && (
                        <RecommendationsSection
                            recommendations={recommendations}
                            recommendationsSliderRef={recommendationsSliderRef}
                            canScrollStates={canScrollStates}
                            scroll={scroll}
                        />
                    )}

                    {/* Reviews */}
                    <ReviewSection
                        reviewContent={reviewContent}
                        reviewersSliderRef={reviewersSliderRef}
                    />
                    
                    {/* Gallery */}
                    <Gallery 
                        contentImages={contentImages} 
                        ORIGINAL_IMG_BASE_URL={ORIGINAL_IMG_BASE_URL}
                    />
                </div>
            </div>
        </div>
    );
}

export default MoreInfoPage;
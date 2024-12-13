/* eslint-disable react/prop-types */
import { Camera, ChevronLeft, ChevronRight } from "lucide-react";
import { ORIGINAL_IMG_BASE_URL } from "../../utils/constants";

export const ActorGallery = ({
    actorDetails,
    actorImages,
    scrollPositions,
    imageScrollRef,
    scrollLeft,
    scrollRight,
    openModal
}) => {
    
    if (actorImages.length === 0) return null;

    return (
        <div className="relative space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-semibold text-blue-400 flex items-center gap-2">
                    <Camera />
                    <span>Photo Gallery</span>
                </h2>
                <button 
                    onClick={() => openModal("Photo Gallery", [...new Map(actorImages.filter(img => img.file_path).map(img => [img.file_path, img])).values()])}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-full text-white transition-colors"
                >
                    View All
                </button>
            </div>

            <div className="relative group">
                {!scrollPositions.gallery.isAtStart && (
                    <button
                        onClick={() => scrollLeft(imageScrollRef, 'gallery')}
                        className="absolute left-0 z-10 p-3 bg-slate-800/90 rounded-full top-1/2 transform -translate-y-1/2 shadow-xl hover:bg-slate-700/90 transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                )}
                
                <div ref={imageScrollRef} className="flex overflow-x-scroll gap-6 p-4 scrollbar-hide">
                    {actorImages.filter(img => img.file_path).map((image, idx) => (
                        <div 
                            key={idx}
                            className="relative flex-shrink-0 cursor-pointer"
                            onClick={() => openModal("Photo Gallery", [image])}
                        >
                            <div className="w-64 h-96 overflow-hidden rounded-lg shadow-lg bg-slate-800">
                                <img
                                    src={`${ORIGINAL_IMG_BASE_URL}${image.file_path}`}
                                    alt={`${actorDetails.name} - Photo ${idx + 1}`}
                                    className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
                                    loading="lazy"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                                <div className="px-4 py-2 bg-blue-600/80 rounded-full backdrop-blur-sm">
                                    <p className="text-white text-sm">Click to View</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {!scrollPositions.gallery.isAtEnd && (
                    <button
                        onClick={() => scrollRight(imageScrollRef, 'gallery')}
                        className="absolute right-0 z-10 p-3 bg-slate-800/90 rounded-full top-1/2 transform -translate-y-1/2 shadow-xl hover:bg-slate-700/90 transition-colors"
                    >
                        <ChevronRight size={24} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default ActorGallery;
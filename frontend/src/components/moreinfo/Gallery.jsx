/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';

const Gallery = ({contentImages, ORIGINAL_IMG_BASE_URL}) => {
    const [showAllModal, setShowAllModal] = useState(false);
    const [activeTab, setActiveTab] = useState('backdrops');
    const [selectedImage, setSelectedImage] = useState(null);
    
    if (!contentImages?.backdrops?.length) {
        return (
            <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Gallery</h2>
                <p className="text-gray-400">No images available.</p>
            </div>
        );
    }

    const totalImages = (contentImages?.backdrops?.length || 0) + 
                       (contentImages?.posters?.length || 0) + 
                       (contentImages?.logos?.length || 0);

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    const navigateImage = (direction) => {
        if (!selectedImage) return;
        
        const currentImages = contentImages[activeTab] || [];
        const currentIndex = currentImages.findIndex(img => img.file_path === selectedImage.file_path);
        
        if (direction === 'next') {
            const nextIndex = (currentIndex + 1) % currentImages.length;
            setSelectedImage(currentImages[nextIndex]);
        } else {
            const prevIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            setSelectedImage(currentImages[prevIndex]);
        }
    };

    const handleKeyPress = (e) => {
        if (selectedImage) {
            if (e.key === 'ArrowLeft') navigateImage('prev');
            if (e.key === 'ArrowRight') navigateImage('next');
            if (e.key === 'Escape') setSelectedImage(null);
        }
    };

    React.useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [selectedImage, activeTab]);

    return (
        <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold">Gallery</h2>
                <button
                    onClick={() => setShowAllModal(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg
                             text-white font-medium transition-colors duration-200
                             flex items-center gap-2"
                >
                    <Eye className="w-5 h-5" />
                    View All ({totalImages})
                </button>
            </div>
            
            {/* Preview Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {contentImages.backdrops.slice(0, 8).map((image, index) => (
                    <div
                        key={index}
                        onClick={() => {
                            setShowAllModal(true);
                            handleImageClick(image);
                        }}
                        className="cursor-pointer relative group"
                    >
                        <div className="aspect-video rounded-lg overflow-hidden">
                            <img
                                src={`${ORIGINAL_IMG_BASE_URL}${image.file_path}`}
                                alt={`Gallery image ${index + 1}`}
                                className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* View All Modal */}
            {showAllModal && (
                <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto">
                    <div className="container mx-auto px-4 py-8">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-white">Media Gallery</h3>
                            <button
                                onClick={() => {
                                    setShowAllModal(false);
                                    setSelectedImage(null);
                                }}
                                className="p-2 hover:text-blue-400 transition-colors"
                            >
                                <X className="w-8 h-8" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-4 mb-6 border-b border-gray-700">
                            <button
                                onClick={() => setActiveTab('backdrops')}
                                className={`pb-2 px-4 transition-colors ${
                                    activeTab === 'backdrops'
                                        ? 'border-b-2 border-blue-500 text-blue-500'
                                        : 'text-gray-400 hover:text-gray-300'
                                }`}
                            >
                                Backdrops ({contentImages?.backdrops?.length || 0})
                            </button>
                            <button
                                onClick={() => setActiveTab('posters')}
                                className={`pb-2 px-4 transition-colors ${
                                    activeTab === 'posters'
                                        ? 'border-b-2 border-blue-500 text-blue-500'
                                        : 'text-gray-400 hover:text-gray-300'
                                }`}
                            >
                                Posters ({contentImages?.posters?.length || 0})
                            </button>
                            <button
                                onClick={() => setActiveTab('logos')}
                                className={`pb-2 px-4 transition-colors ${
                                    activeTab === 'logos'
                                        ? 'border-b-2 border-blue-500 text-blue-500'
                                        : 'text-gray-400 hover:text-gray-300'
                                }`}
                            >
                                Logos ({contentImages?.logos?.length || 0})
                            </button>
                        </div>

                        {/* Images Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {contentImages[activeTab]?.map((image, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleImageClick(image)}
                                    className="cursor-pointer relative group"
                                >
                                    <div className={`
                                        rounded-lg overflow-hidden
                                        ${activeTab === 'backdrops' ? 'aspect-video' : 
                                          activeTab === 'posters' ? 'aspect-[2/3]' : 
                                          'aspect-square'}
                                    `}>
                                        <img
                                            src={`${ORIGINAL_IMG_BASE_URL}${image.file_path}`}
                                            alt={`${activeTab} image ${index + 1}`}
                                            className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {contentImages[activeTab]?.length === 0 && (
                            <p className="text-gray-400 text-center py-8">
                                No {activeTab} available
                            </p>
                        )}

                        {/* Full Screen Image View */}
                        {selectedImage && (
                            <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                                <div className="relative w-full max-w-7xl mx-auto">
                                    <button
                                        onClick={() => setSelectedImage(null)}
                                        className="absolute -top-12 right-0 p-2 text-white hover:text-blue-400 transition-colors"
                                    >
                                        <X className="w-8 h-8" />
                                    </button>
                                    
                                    {/* Navigation Buttons */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigateImage('prev');
                                        }}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white hover:text-blue-400 transition-colors bg-black/50 rounded-full"
                                    >
                                        <ChevronLeft className="w-8 h-8" />
                                    </button>
                                    
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigateImage('next');
                                        }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white hover:text-blue-400 transition-colors bg-black/50 rounded-full"
                                    >
                                        <ChevronRight className="w-8 h-8" />
                                    </button>
                                    
                                    <img
                                        src={`${ORIGINAL_IMG_BASE_URL}${selectedImage.file_path}`}
                                        alt="Selected gallery image"
                                        className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;
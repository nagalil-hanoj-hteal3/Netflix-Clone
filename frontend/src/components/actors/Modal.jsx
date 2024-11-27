/* eslint-disable react/prop-types */
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { ORIGINAL_IMG_BASE_URL } from "../../utils/constants";
import { useContentStore } from "../../store/content";

export const Modal = ({ isOpen, onClose, title, content }) => {
    if (!isOpen) return null;

    const modalContent = Array.isArray(content) ? content : [content];
    const isSingleImage = modalContent?.length === 1;
    const isMovieModal = title.includes("Movies");
    const isTVModal = title.includes("TV Shows");

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
            <div className={`
                ${isSingleImage 
                    ? 'w-full max-w-full h-[95vh] p-4' 
                    : 'bg-gray-800 p-6 rounded-lg w-full max-w-4xl md:max-w-3xl sm:max-w-xl max-h-[95vh] flex flex-col'}
                text-white relative flex flex-col
            `}>
                <div className="sticky top-0 z-50 py-2">
                    {!isSingleImage && (
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">{title}</h2>
                            <button 
                                onClick={onClose} 
                                className="text-white hover:text-gray-300"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    )}

                    {isSingleImage && (
                        <button 
                            onClick={onClose} 
                            className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
                        >
                            <X size={32} />
                        </button>
                    )}
                </div>

                <div className={`
                    ${isSingleImage 
                        ? 'w-full h-full flex items-center justify-center' 
                        : 'grid grid-cols-2 sm:grid-cols-3 gap-4 overflow-y-auto'}
                    overflow-y-auto max-h-[100vh]
                `}>
                    {modalContent?.map((item, idx) => (
                        <div 
                            key={idx} 
                            className={`
                                ${isSingleImage 
                                    ? 'w-full h-full flex items-center justify-center' 
                                    : 'flex flex-col items-center relative group transform transition-all duration-500 hover:scale-90'}
                            `}
                        >
                            {(isMovieModal || isTVModal) ? (
                                <Link
                                    to={`/${isMovieModal ? 'movie' : 'tv'}/moreinfo/${item?.id}`}
                                    onClick={() => 
                                        useContentStore?.getState()?.setContentType(isMovieModal ? 'movie' : 'tv')
                                    }
                                    className="w-full h-full"
                                >
                                    <img
                                        src={`${ORIGINAL_IMG_BASE_URL}${item.poster_path || item.file_path}`}
                                        alt={item.title || item.name || `Image ${idx + 1}`}
                                        className={'w-full h-full object-cover rounded-lg'}
                                    />
                                </Link>
                            ) : (
                                <img
                                    src={`${ORIGINAL_IMG_BASE_URL}${item?.poster_path || item?.file_path}`}
                                    alt={item?.title || item?.name || `Image ${idx + 1}`}
                                    className={`
                                        ${isSingleImage 
                                            ? 'max-w-full max-h-full object-contain' 
                                            : 'w-full h-full object-cover rounded-lg'}
                                    `}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Modal;
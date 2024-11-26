/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Info, X } from "lucide-react";

const InfoIconWithTooltip = ({ content, className = "" }) => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = (e) => {
        e.stopPropagation(); // Prevent event from bubbling up
        setIsVisible(!isVisible);
    };

    // Close when clicking outside
    const handleClickOutside = () => {
        if (isVisible) {
            setIsVisible(false);
        }
    };

    // Add event listener for clicking outside
    React.useEffect(() => {
        if (isVisible) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    });

    return (
        <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
            <Info className={`ml-10 mt-1 lg:mt-2 h-7 w-7 text-gray-300 hover:text-blue-600 cursor-pointer ${className}`}
            onClick={toggleVisibility}/>
            
            {isVisible && (
                <div className="absolute left-1/2 transform -translate-x-1/2 z-50" style={{ width: '600px' }}>
                    <div className="flex items-center justify-center w-full px-4">
                        <div className="bg-gray-800 w-full max-w-full self-center p-4 rounded-lg mt-8 sm:max-w-[95%] md:max-w-[90%] lg:max-w-[85%] xl:max-w-[80%] shadow-xl relative">
                            {/* Close button */}
                            <button onClick={() => setIsVisible(false)} className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-700 transition-colors">
                                <X className="h-5 w-5 text-gray-300 hover:text-white" />
                            </button>

                            <h3 className="text-xl font-bold mb-2 text-white pr-8">Quick Facts</h3>
                            <ul className="space-y-2 text-white text-sm">
                                {content?.budget !== undefined && content?.budget !== null && (
                                    <li className="flex items-center gap-2">
                                    <span className="font-semibold">Budget:</span>
                                    <span>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(content.budget)}</span>
                                    </li>
                                )}
                                {content?.revenue !== undefined && content?.revenue !== null && (
                                    <li className="flex items-center gap-2">
                                    <span className="font-semibold">Revenue:</span>
                                    <span>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(content.revenue)}</span>
                                    </li>
                                )}
                                {content?.homepage && (
                                    <li className="flex items-center gap-2">
                                    <span className="font-semibold">Homepage:</span>
                                    <a href={content.homepage} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                        Visit
                                    </a>
                                    </li>
                                )}
                                {content?.production_companies?.length > 0 && (
                                    <li>
                                    <span className="font-semibold block mb-2">Production Companies:</span>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {content.production_companies.map((company) => (
                                        <div
                                            key={company.id}
                                            className="flex flex-col items-center text-center bg-gray-700 p-2 rounded-lg"
                                        >
                                            {company.logo_path && (
                                            <img
                                                src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                                                alt={company.name}
                                                className="h-12 object-contain mb-1"
                                            />
                                            )}
                                            <span className="font-semibold text-xs">{company.name}</span>
                                            <span className="text-xs text-gray-400">{company.origin_country}</span>
                                        </div>
                                        ))}
                                    </div>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InfoIconWithTooltip;
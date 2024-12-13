/* eslint-disable react/prop-types */
import {User} from 'lucide-react';

export const ActorHeader = ({ actorDetails, ORIGINAL_IMG_BASE_URL }) => (
    <div className="flex flex-col items-center md:items-start">
        <div className="relative group">
            {actorDetails?.profile_path ? (
                <>
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                    <img 
                        src={`${ORIGINAL_IMG_BASE_URL}${actorDetails?.profile_path}`}
                        alt={actorDetails?.name}
                        className="relative sm:w-auto sm:h-72 md:w-96 md:h-auto rounded-lg shadow-2xl object-cover transform transition-all duration-500 hover:scale-105"
                    />
                </>
            ) : (
                <div className="relative sm:w-auto sm:h-72 md:w-96 rounded-lg shadow-2xl flex items-center justify-center bg-gray-700">
                    <User className="text-gray-400" size={96} />
                </div>
            )}
        </div>
        <div className="text-left mt-6 space-y-2">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent py-1">
                {actorDetails?.name}
            </h1>
            <p className="text-blue-400 text-xl font-medium">
                {actorDetails?.known_for_department}
            </p>
        </div>
    </div>
);
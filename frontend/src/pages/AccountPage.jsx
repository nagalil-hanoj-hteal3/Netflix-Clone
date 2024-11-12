import { useState } from "react";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/authUser";
import { XCircle } from 'lucide-react';

const AccountPage = () => {
    const { user, updateUser } = useAuthStore();
    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState(user.image);
    const [tempAvatar, setTempAvatar] = useState(user.image);

    const avatars = Array.from({ length: 58 }, (_, i) => `/avatar/${i + 1}.png`).concat(
        "/avatar/avatar1.png",
        "/avatar/avatar2.jpg",
        "/avatar/avatar3.png"
    );

    const handleSave = () => {
        if (username && email) {
            updateUser({ ...user, username, email, image: selectedAvatar });
            setIsModalOpen(false);
        }
    };

    const confirmAvatarSelection = () => {
        setSelectedAvatar(tempAvatar);
        setIsModalOpen(false);
    };

    return (
        <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen text-white">
            <Navbar />
            <div className="p-6 flex flex-col items-center gap-6">
                <h1 className="text-3xl font-bold mb-4">Account Settings</h1>
                
                <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4 text-center">Profile Information</h2>
                    
                    <div className="flex items-center gap-4 mb-6">
                        <img
                            src={selectedAvatar}
                            alt="Current Avatar"
                            className="h-24 w-24 rounded-full cursor-pointer border-4 border-blue-500 hover:opacity-90"
                            onClick={() => setIsModalOpen(true)}
                        />
                        <div>
                            <h3 className="text-xl font-semibold">Change Avatar</h3>
                            <p className="text-sm text-gray-400">Click the avatar to choose a new one</p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-lg font-medium mb-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your new username"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-lg font-medium mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your new email"
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={!username || !email}
                        className={`w-full ${
                            !username || !email ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700"
                        } text-white font-semibold py-2 rounded transition-colors`}
                    >
                        Save Changes
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    {/* Modal container with scrollable content */}
                    <div className="bg-gray-800 p-6 rounded-lg max-w-lg max-h-[80vh] overflow-y-auto shadow-lg relative">
                        {/* Close icon */}
                        <XCircle
                            onClick={() => setIsModalOpen(false)} // Close the modal
                            className="absolute top-4 right-4 text-white cursor-pointer hover:text-gray-400"
                            size={24}
                        />

                        <h2 className="text-2xl font-semibold text-white mb-4">Select an Avatar</h2>
                        <p className="text-gray-400 mb-6 text-sm">Click on an avatar to select it, then confirm your choice.</p>
                        
                        <div className="grid grid-cols-4 gap-4">
                            {avatars.map((avatar) => (
                                <img
                                    key={avatar}
                                    src={avatar}
                                    alt="Avatar Option"
                                    className={`h-20 w-20 rounded-full cursor-pointer transition-transform transform hover:scale-110 ${
                                        tempAvatar === avatar ? "ring-4 ring-blue-500" : ""
                                    }`}
                                    onClick={() => setTempAvatar(avatar)}
                                />
                            ))}
                        </div>

                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-600 text-white font-semibold py-2 px-4 rounded transition-colors hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmAvatarSelection}
                                className="bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors hover:bg-blue-700"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountPage;

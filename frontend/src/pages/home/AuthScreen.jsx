import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import TrailerLoadingScreen from "../../components/skeletons/LoadingWebsite.jsx";
import { ChevronRight, Film, Tv, TvMinimalPlay, Gamepad, Popcorn } from "lucide-react";

const AuthScreen = () => {
    const [email, setEmail] = useState("");
    const [imgLoading, setImgLoading] = useState(true);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        navigate("/signup?email=" + email);
    }

    const handleLogin = (e) => {
        e.preventDefault();
        navigate("/login");
    }

    if(isLoading){
        return <TrailerLoadingScreen/>;
    }

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Hero Section with Background Image */}
            <div className="relative min-h-screen">
                {/* Background Image */}
                <div className="absolute inset-0 w-full h-full">
                    {imgLoading && (
                        <div className="absolute inset-0 bg-blue-900/30 animate-pulse" />
                    )}
                    <img
                        src="/TrailoHubLogo.png"
                        alt="Background"
                        className="w-full h-full object-cover"
                        onLoad={() => setImgLoading(false)}
                    />
                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 container mx-auto px-4 lg:px-8 flex flex-col items-center justify-center text-center py-32">
                    <div className="max-w-3xl space-y-6 md:mt-10">
                        <div className="flex justify-center gap-4 mb-4">
                            <Popcorn className="size-8 text-yellow-400 animate-pulse delay-100"/>
                            <Gamepad className="size-8 text-teal-400 animate-pulse delay-200"/>
                            <Film className="size-8 text-blue-400 animate-pulse" />
                            <Tv className="size-8 text-purple-400 animate-pulse delay-200" />
                            <TvMinimalPlay className="size-8 text-pink-400 animate-pulse delay-100" />  
                        </div>
                        
                        {/* Main Content */}
                        <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text animate-gradient">
                        Unlimited trailers for movies, TV shows, and more
                        </h1>
                        
                        <p className="text-blue-200 text-xl lg:text-2xl font-medium">
                        Your Front Row Seat to the Latest Trailers
                        </p>
                        
                        <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto">
                        Join millions of viewers exploring endless entertainment. Premium content, exclusive originals, and live events - all in one place.
                        </p>

                        {/* Action Buttons Container */}
                        <div className="space-y-4">
                        {/* Sign Up Form */}
                            <form 
                                className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto"
                                onSubmit={handleFormSubmit}
                            >
                                <input 
                                type="email" 
                                className="flex-1 bg-slate-900/80 backdrop-blur-sm text-white border border-slate-700 rounded-lg px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your email to begin"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                />
                                <button 
                                type="submit"
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg flex items-center justify-center gap-2 transition-all"
                                >
                                Start Exploring
                                <ChevronRight className="size-5" />
                                </button>
                            </form>

                            {/* Login Section */}
                            <div className="flex items-center justify-center gap-2">
                                <span className="text-slate-400">Already have an account?</span>
                                <button 
                                onClick={handleLogin}
                                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                                >
                                Log in
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature Sections */}
            <div className="container mx-auto px-4 lg:px-8 py-12">
                <div className="space-y-24">
                    {/* TV Section */}
                    <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-8 border border-slate-800">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-1">
                                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                                    Enjoy on your TV
                                </h2>
                                <p className="text-slate-300 text-lg leading-relaxed">
                                    Watch on Smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.
                                </p>
                            </div>
                            <div className="flex-1 relative">
                                <img src="/tv.png" alt="TV" className="relative z-10" />
                                <video 
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1/2 z-0"
                                    autoPlay 
                                    playsInline 
                                    muted 
                                    loop
                                >
                                    <source src="/smallDemo.mp4" type="video/mp4" />
                                </video>
                            </div>
                        </div>
                    </div>

                    {/* Download Section */}
                    <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-8 border border-slate-800">
                        <div className="flex flex-col md:flex-row-reverse items-center gap-8">
                            <div className="flex-1">
                                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                                    Download your shows to watch offline
                                </h2>
                                <p className="text-slate-300 text-lg leading-relaxed">
                                    Save your favorites easily and always have something to watch.
                                </p>
                            </div>
                            <div className="flex-1 relative">
                                <img src="/stranger-things-lg.png" alt="Stranger Things" className="w-full" />
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-slate-700 rounded-lg p-4 flex items-center gap-4 w-3/4">
                                    <img src="/stranger-things-sm.png" alt="Stranger Things" className="h-16" />
                                    <div className="flex-1">
                                        <p className="text-white font-semibold">Stranger Things</p>
                                        <p className="text-blue-400">Downloading...</p>
                                    </div>
                                    <img src="/download-icon.gif" alt="Download" className="h-12" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Watch Everywhere Section */}
                    <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-8 border border-slate-800">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-1">
                                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                                    Watch everywhere
                                </h2>
                                <p className="text-slate-300 text-lg leading-relaxed">
                                    Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.
                                </p>
                            </div>
                            <div className="flex-1 relative overflow-hidden">
                                <img src="/device-pile.png" alt="Devices" className="relative z-10" />
                                <video 
                                    className="absolute top-2 left-1/2 -translate-x-1/2 h-4/6 z-0 max-w-[63%]"
                                    autoPlay 
                                    playsInline 
                                    muted 
                                    loop
                                >
                                    <source src="/video-devices.m4v" type="video/mp4" />
                                </video>
                            </div>
                        </div>
                    </div>

                    {/* Kids Section */}
                    <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-8 border border-slate-800">
                        <div className="flex flex-col md:flex-row-reverse items-center gap-8">
                            <div className="flex-1">
                                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                                    Create profiles for kids
                                </h2>
                                <p className="text-slate-300 text-lg leading-relaxed">
                                    Send kids on adventures with their favorite characters in a space made just for them—free with your membership.
                                </p>
                            </div>
                            <div className="flex-1">
                                <img src="/kids.png" alt="Kids" className="w-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthScreen;
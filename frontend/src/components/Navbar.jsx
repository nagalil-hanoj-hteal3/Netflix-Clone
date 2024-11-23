import {Link} from "react-router-dom";
import {useState} from "react";
import {Search, Menu, LogOut} from "lucide-react";
import { useAuthStore } from "../store/authUser";
import { useContentStore } from "../store/content";

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const {user, logout} = useAuthStore();
    const {setContentType} = useContentStore();

    return (
        <header className="bg-slate-900 border-b border-slate-800 relative">
            <div className="max-w-[1920px] w-full mx-auto flex flex-wrap items-center justify-between px-4 md:px-6 h-20">
                <div className="flex items-center gap-6 md:gap-10 relative">
                    <Link to="/" onClick={() => isMobileMenuOpen && toggleMobileMenu()}>
                        <p className="text-white text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide relative inline-block group">
                            Trailo-Hub
                            <span className="absolute left-0 bottom-[-4px] h-1 w-0 bg-blue-500 rounded-full transition-all duration-300 group-hover:w-full"></span>
                        </p>
                    </Link>

                    {/* Desktop navbar items */}
                    <div className="hidden sm:flex gap-4 md:gap-6 items-center text-slate-300">
                        <Link 
                            to="/" 
                            className="hover:text-white transition-colors duration-200 relative group whitespace-nowrap"
                            onClick={() => setContentType("movie")}
                        >
                            Movies
                            <span className="absolute inset-x-0 bottom-[-4px] h-0.5 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                        </Link>
                        <Link 
                            to="/" 
                            className="hover:text-white transition-colors duration-200 relative group whitespace-nowrap"
                            onClick={() => setContentType("tv")}
                        >
                            TV Shows
                            <span className="absolute inset-x-0 bottom-[-4px] h-0.5 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                        </Link>
                        <Link 
                            to="/history" 
                            className="hover:text-white transition-colors duration-200 relative group whitespace-nowrap"
                        >
                            Search History
                            <span className="absolute inset-x-0 bottom-[-4px] h-0.5 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-4 md:gap-6">
                    <Link 
                        to="/search" 
                        className="text-slate-300 hover:text-white transition-colors duration-200"
                        onClick={() => isMobileMenuOpen && toggleMobileMenu()}
                    >
                        <Search className="size-5 md:size-6" />
                    </Link>
                    <Link 
                        to="/account" 
                        onClick={() => isMobileMenuOpen && toggleMobileMenu()}
                        className="relative group"
                    >
                        <div className="ring-2 ring-transparent hover:ring-blue-500 rounded-full transition-all duration-200">
                            <img src={user.image} alt="Avatar" className="h-8 w-8 rounded-full object-cover" />
                        </div>
                    </Link>
                    <button 
                        className="text-slate-300 hover:text-white transition-colors duration-200"
                        onClick={logout}
                    >
                        <LogOut className="size-5 md:size-6" />
                    </button>
                    {/* Mobile hamburger menu */}
                    <div className="sm:hidden">
                        <button 
                            className="text-slate-300 hover:text-white transition-colors duration-200 p-1" 
                            onClick={toggleMobileMenu}
                        >
                            <Menu className="size-6" />
                        </button>
                    </div>
                </div>

                {/* Mobile navbar items */}
                {isMobileMenuOpen && (
                    <div className="w-full sm:hidden absolute top-20 left-0 z-50">
                        <div className="bg-slate-800 text-slate-300 border border-slate-700 mx-4 rounded-lg shadow-lg backdrop-blur-sm bg-opacity-95">
                            <Link 
                                to="/" 
                                className="block p-4 hover:bg-slate-700 hover:text-white transition-all duration-200 rounded-t-lg"
                                onClick={() => { setContentType("movie"); toggleMobileMenu(); }}
                            >
                                Movies
                            </Link>
                            <Link 
                                to="/" 
                                className="block p-4 hover:bg-slate-700 hover:text-white transition-all duration-200"
                                onClick={() => { setContentType("tv"); toggleMobileMenu(); }}
                            >
                                TV Shows
                            </Link>
                            <Link 
                                to="/history" 
                                className="block p-4 hover:bg-slate-700 hover:text-white transition-all duration-200 rounded-b-lg"
                                onClick={toggleMobileMenu}
                            >
                                Search History
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;
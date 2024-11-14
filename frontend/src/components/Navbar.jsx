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
    // console.log("contentType: ", contentType);

    return (
        <header className="max-w-8xl mx-auto flex flex-wrap items-center justify-between p-4 h-20">
            <div className="flex items-center gap-10 z-50 relative">
                <Link to="/" onClick={() => isMobileMenuOpen && toggleMobileMenu()}>
                    <img src="/netflix-logo.png" alt="Netflix logo" className="w-32 sm:w-40" />
                </Link>

                {/* Desktop navbar items */}
                <div className="hidden sm:flex gap-2 items-center">
                    <Link to="/" className="hover:underline" onClick={() => setContentType("movie")}>Movies</Link>
                    <Link to="/" className="hover:underline" onClick={() => setContentType("tv")}>TV Shows</Link>
                    <Link to="/history" className="hover:underline">Search History</Link>
                </div>
            </div>

            <div className="flex gap-2 items-center z-50">
                <Link to="/search" onClick={() => isMobileMenuOpen && toggleMobileMenu()}>
                    <Search className="size-6 cursor-pointer" />
                </Link>
                <Link to="/account" onClick={() => isMobileMenuOpen && toggleMobileMenu()}>
                    <img src={user.image} alt="Avatar" className="h-8 rounded cursor-pointer" />
                </Link>
                 {/* Mobile hamburger menu */}
                 <div className="sm:hidden">
                    <button className="p-2" onClick={toggleMobileMenu}>
                        <Menu className="size-6 cursor-pointer" />
                    </button>
                </div>
                <LogOut className="size-6 cursor-pointer" onClick={logout} />
            </div>

            {/* Mobile navbar items */}
            {isMobileMenuOpen && (
                <div className="w-full sm:hidden mt-4 z-50 bg-black text-white border rounded border-gray-800 absolute top-20 left-0">
                    <Link to="/" className="block hover:underline p-2" onClick={() => { setContentType("movie"); toggleMobileMenu(); }}>Movies</Link>
                    <Link to="/" className="block hover:underline p-2" onClick={() => { setContentType("tv"); toggleMobileMenu(); }}>TV Shows</Link>
                    <Link to="/history" className="block hover:underline p-2" onClick={toggleMobileMenu}>Search History</Link>
                </div>
            )}
        </header>
    );
};

export default Navbar;
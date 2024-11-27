import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Search, Menu, LogOut, ChevronDown } from "lucide-react";
import { useAuthStore } from "../store/authUser";
import { useContentStore } from "../store/content";

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openCategory, setOpenCategory] = useState(null);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const {user, logout} = useAuthStore();
    const {setContentType} = useContentStore();

    const NavLinks = [
        { 
            name: 'Browse', 
            links: [
                { title: 'Movies', path: '/', action: () => setContentType("movie") },
                { title: 'TV Shows', path: '/', action: () => setContentType("tv") },
                { title: 'Trending', path: '/trending' },
            ]
        },
        { 
            name: 'Discover', 
            links: [
                { title: 'Search History', path: '/history' },
                { title: 'Bookmarks', path: '/bookmark' },
            ]
        }
    ];

    const toggleCategoryDropdown = (categoryName) => {
        setOpenCategory(openCategory === categoryName ? null : categoryName);
    };

    return (
        <header className="bg-slate-900 border-b border-slate-800 relative">
            <div className="max-w-[1920px] w-full mx-auto flex flex-wrap items-center justify-between px-4 md:px-6 h-20">
                {/* Logo */}
                <div className="flex items-center gap-6 md:gap-10 relative">
                    <Link to="/" onClick={() => isMobileMenuOpen && toggleMobileMenu()}>
                        <p className="text-white text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide relative inline-block group">
                            Trailo-Hub
                            <span className="absolute left-0 bottom-[-4px] h-1 w-0 bg-blue-500 rounded-full transition-all duration-300 group-hover:w-full"></span>
                        </p>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden sm:flex space-x-6">
                        {NavLinks.map((category, index) => (
                            <div key={index} className="relative group">
                                <button className="text-slate-300 hover:text-white flex items-center gap-1 transition-colors duration-200">
                                    {category.name}
                                    <ChevronDown className="size-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                                </button>
                                <div className="absolute top-full left-0 pt-4 hidden group-hover:block z-50">
                                    <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden min-w-[200px]">
                                        {category.links.map((link, linkIndex) => (
                                            <Link 
                                                key={linkIndex} 
                                                to={link.path} 
                                                onClick={link.action}
                                                className="block px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors duration-200"
                                            >
                                                {link.title}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </nav>
                </div>

                {/* Right Side Icons */}
                <div className="flex items-center gap-4 md:gap-6">
                    <Link 
                        to="/search" 
                        className="text-slate-300 hover:text-blue-500 transition-colors duration-200"
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
                        className="text-slate-300 hover:text-blue-500 transition-colors duration-200"
                        onClick={logout}
                    >
                        <LogOut className="size-5 md:size-6" />
                    </button>

                    {/* Mobile Menu Toggle */}
                    <div className="sm:hidden">
                        <button 
                            className="text-slate-300 hover:text-white transition-colors duration-200 p-1" 
                            onClick={toggleMobileMenu}
                        >
                            <Menu className="size-6" />
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="w-full sm:hidden absolute top-20 left-0 z-50">
                        <div className="bg-slate-800 text-slate-300 border border-slate-700 mx-4 rounded-lg shadow-lg backdrop-blur-sm bg-opacity-95">
                            {NavLinks.map((category, index) => (
                                <div key={index}>
                                    <div 
                                        className="px-4 py-3 font-semibold text-slate-400 border-b border-slate-700 flex justify-between items-center cursor-pointer"
                                        onClick={() => toggleCategoryDropdown(category.name)}
                                    >
                                        {category.name}
                                        <ChevronDown 
                                            className={`size-4 transition-transform duration-200 ${
                                                openCategory === category.name ? 'rotate-180' : ''
                                            }`} 
                                        />
                                    </div>
                                    {openCategory === category.name && category.links.map((link, linkIndex) => (
                                        <Link 
                                            key={linkIndex} 
                                            to={link.path} 
                                            onClick={() => { 
                                                link.action && link.action(); 
                                                toggleMobileMenu(); 
                                            }}
                                            className="block p-4 hover:bg-slate-700 hover:text-white transition-all duration-200"
                                        >
                                            {link.title}
                                        </Link>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;
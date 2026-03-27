import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiMenu, HiX, HiUserCircle } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen
} from 'lucide-react';


const Navbar = ({ isAuthenticated, user, onLoginClick, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const displayName = user?.displayName?.split(' ')[0] || user?.firstName || user?.email?.split('@')[0] || 'Account';

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="bg-[#12181b] backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 text-emerald-500">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <BookOpen size={28} strokeWidth={2.5} />
                        <span className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                            StudyHub
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/memes" className="text-white hover:text-emerald-400 transition-colors font-medium">Meme</Link>
                        <Link to="/features" className="text-white hover:text-emerald-400 transition-colors font-medium">Features</Link>
                        <Link to="/admin-login" className="text-gray-500 hover:text-emerald-400 transition-colors font-medium text-xs">Admin</Link>
                        {isAuthenticated && (
                            <Link to="/saved" className="text-white hover:text-emerald-400 transition-colors font-medium">Saved</Link>
                        )}

                        {isAuthenticated ? (
                            <div className="flex items-center space-x-3 ">
                                <Link to="/upload" className="flex items-center space-x-1 text-white hover:text-emerald-400">
                                    <span>Upload</span>
                                </Link>
                                <div className="relative" ref={dropdownRef}>
                                    <div
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 cursor-pointer hover:bg-white/20 transition-colors select-none"
                                    >
                                        <HiUserCircle className="w-6 h-6 text-emerald-400" />
                                        <span className="font-semibold text-sm text-white">{displayName}</span>
                                        <span className={`text-white text-xs transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>▾</span>
                                    </div>

                                    {/* Dropdown Logout */}
                                    <AnimatePresence>
                                        {isDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.92, y: -8 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.92, y: -8 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute right-0 mt-2 w-40 py-2 bg-[#1a2226] rounded-xl shadow-2xl border border-white/10 z-50"
                                            >
                                                <div className="px-4 py-2 border-b border-white/10 mb-1">
                                                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setIsDropdownOpen(false);
                                                        onLogout();
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                                                >
                                                    🚪 Logout
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={onLoginClick}
                                className="bg-blue-500 px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-400 hover:bg-blue-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-white"
                            >
                                Login
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={toggleMenu} className="text-gray-700 focus:outline-none">
                            {isOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
                    >
                        <div className="px-4 py-2 space-y-1">
                            <Link to="/memes" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-green hover:bg-blue-50">Meme</Link>
                            <Link to="/features" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-green hover:bg-blue-50">Features</Link>
                            {isAuthenticated && (
                                <Link to="/saved" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-green hover:bg-blue-50">Saved</Link>
                            )}
                            {isAuthenticated ? (
                                <>
                                    <Link to="/upload" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-green hover:bg-blue-50">Upload Notes</Link>
                                    <div className="px-3 py-2 flex items-center space-x-2">
                                        <HiUserCircle className="w-5 h-5 text-brand-green" />
                                        <span className="font-medium text-gray-900">{user?.firstName}</span>
                                    </div>
                                    <button onClick={onLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-50">Logout</button>
                                </>
                            ) : (
                                <button
                                    onClick={onLoginClick}
                                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-brand-green hover:bg-green-50"
                                >
                                    Login
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>

        </nav>

    );
};

export default Navbar;

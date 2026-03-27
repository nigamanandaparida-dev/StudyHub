import React from 'react';
import { FaTwitter, FaInstagram, FaFacebook, FaLinkedin } from 'react-icons/fa';
import {
  BookOpen,
} from 'lucide-react';
const Footer = () => {
    return (
        <footer className="bg-[#12181b] border-t  py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-center space-y-6 text-emerald-500">
                    {/* Logo */}
                    <BookOpen size={28} strokeWidth={2.5} />
                    <div className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                
                        StudyHub
                    </div>

                    {/* Social Links */}
                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors transform hover:scale-110">
                            <FaTwitter className="w-6 h-6" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors transform hover:scale-110">
                            <FaInstagram className="w-6 h-6" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors transform hover:scale-110">
                            <FaFacebook className="w-6 h-6" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-blue-700 transition-colors transform hover:scale-110">
                            <FaLinkedin className="w-6 h-6" />
                        </a>
                    </div>

                    {/* Tagline */}
                    <p className="text-gray-500 text-sm font-medium">
                        StudyHub - Made by Students, For Students
                    </p>

                    <div className="text-xs text-gray-400">
                        © {new Date().getFullYear()} StudyHub. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

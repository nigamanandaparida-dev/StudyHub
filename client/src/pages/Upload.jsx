import React, { useState } from 'react';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { HiUpload, HiDocumentText, HiPhotograph } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const Upload = ({ user }) => {
    const [activeTab, setActiveTab] = useState('note'); // 'note' or 'meme'
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [uploading, setUploading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append(activeTab === 'note' ? 'file' : 'image', file);
        formData.append('title', title);
        if (user) {
            formData.append('userId', user.uid);
            formData.append('uploaderName', user.displayName || user.firstName || user.email || 'Anonymous');
        }

        try {
            const endpoint = activeTab === 'note' ? '/api/notes/upload' : '/api/memes/upload';
            await api.post(endpoint, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                navigate(activeTab === 'note' ? '/explore' : '/memes');
            }, 2000);
        } catch (error) {
            console.error('Upload failed', error);
            let errorMessage = 'Upload failed: ';

            if (error.response) {
                // Server responded with an error (4xx or 5xx)
                const data = error.response.data;
                errorMessage += data.message || data.details || 'Server error occurred.';
                if (data.details && data.message) {
                    errorMessage += `\n\nDetails: ${data.details}`;
                }
            } else if (error.request) {
                // Request made but no response received
                errorMessage += 'The server did not respond. Please ensure the backend is running.';
            } else {
                errorMessage += error.message;
            }

            alert(errorMessage);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#12181b] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-white">Upload Content</h1>
                    <p className="mt-2 text-slate-400">Share your knowledge or your humor with the world.</p>
                </div>

                {/* Tab Switcher */}
                <div className="bg-white p-1 rounded-xl shadow-sm mb-8 flex">
                    <button
                        onClick={() => setActiveTab('note')}
                        className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center space-x-2 ${activeTab === 'note'
                            ? 'bg-green-700 text-white shadow-md'
                            : 'text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        <HiDocumentText className="w-5 h-5" />
                        <span>Upload Notes</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('meme')}
                        className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center space-x-2 ${activeTab === 'meme'
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        <HiPhotograph className="w-5 h-5" />
                        <span>Upload Meme</span>
                    </button>
                </div>

                <motion.div
                    layout
                    className="bg-[#12181b] rounded-2xl shadow-xl overflow-hidden border border-gray-100"
                >
                    <div className="p-8">
                        <h2 className="text-xl font-bold mb-6 text-white">
                            {activeTab === 'note' ? 'Upload Course Materials' : 'Share a Meme'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    {activeTab === 'note' ? 'Title / Subject' : 'Caption / Title'}
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/50 text-white"
                                    placeholder={activeTab === 'note' ? "Write Your Title" : "e.g., When the code compiles..."}
                                    required
                                />
                            </div>

                            <div className="group border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-brand-green hover:bg-green-50/50 transition-all relative">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer "
                                    required
                                    accept={activeTab === 'note' ? ".pdf,.doc,.docx,.jpg,.png" : ".jpg,.jpeg,.png,.gif"}
                                />
                                <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-brand-green mb-4 transition-colors">
                                    <HiUpload className="w-8 h-8" />
                                </div>
                                <p className="text-gray-500 group-hover:text-gray-700 font-medium">
                                    {file ? file.name : "Drag & drop or Click to Browse"}
                                </p>
                                <p className="text-xs text-gray-400 mt-2">
                                    {activeTab === 'note' ? "PDF, Images, DOC up to 10MB" : "JPG, PNG, GIF"}
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={uploading}
                                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center space-x-2 transition-all ${uploading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : activeTab === 'note' ? 'bg-brand-green hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
                                    }`}
                            >
                                {uploading ? (
                                    <span>Uploading...</span>
                                ) : (
                                    <>
                                        <HiUpload className="w-5 h-5" />
                                        <span>{activeTab === 'note' ? 'Upload Note' : 'Post Meme'}</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>

            {/* Success Popup */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 50, x: '-50%' }}
                        className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-green-900 text-white px-8 py-4 rounded-full shadow-2xl z-50 flex items-center space-x-3"
                    >
                        <div className="bg-white rounded-full p-1">
                            <HiUpload className="w-4 h-4 text-green-900" />
                        </div>
                        <span className="font-bold">Successfully Uploaded!</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Upload;

import React from 'react';
import { HiBookmark, HiOutlineBookmark } from 'react-icons/hi';
import { motion } from 'framer-motion';

const NoteCard = ({ note, onSave, onOpen, isSaved }) => {
    // If it's a PDF, Cloudinary can generate a thumbnail by changing extension to .jpg (if resource_type is handled correctly)
    // Assuming fileUrl is from Cloudinary: e.g. .../upload/v123/sample.pdf
    // We can try to replace .pdf with .jpg for preview
    const getPreviewUrl = (url, type) => {
        if (!url) return 'https://via.placeholder.com/400x320?text=No+File';

        const fullUrl = url.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL}${url}` : url;

        if (type === 'pdf') {
            if (fullUrl.includes('cloudinary')) {
                if (fullUrl.endsWith('.pdf')) return fullUrl.replace('.pdf', '.jpg');
            }
            // For local PDFs, we can't easily generate thumbnails, so show a placeholder
            return 'https://via.placeholder.com/400x320?text=PDF+Document';
        }
        return fullUrl; // images
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 flex flex-col h-full"
        >
            <div className="h-48 bg-gray-100 relative group overflow-hidden">
                {/* Preview Image */}
                <img
                    src={getPreviewUrl(note.fileUrl, note.fileType)}
                    alt={note.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x320?text=No+Preview'; }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                    <button
                        onClick={() => onOpen(note)}
                        className="bg-white text-brand-black px-4 py-2 rounded-full font-bold hover:bg-brand-green hover:text-white transition-colors"
                    >
                        Open
                    </button>
                    <button
                        onClick={() => onSave(note._id)}
                        className="bg-white p-2 rounded-full text-brand-black hover:text-brand-green transition-colors"
                    >
                        {isSaved ? <HiBookmark className="w-6 h-6" /> : <HiOutlineBookmark className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">{note.title}</h3>
                <p className="text-xs text-gray-500 mb-4">Uploaded by {note.uploaderName || note.uploader?.firstName || 'Anonymous'}</p>

                <div className="mt-auto">
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-semibold uppercase">{note.fileType}</span>
                        <span className="text-xs">{new Date(note.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* Open & Save Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => onOpen(note)}
                            className="flex-1 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold rounded-lg hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-95"
                        >
                            📄 Open
                        </button>
                        <button
                            onClick={() => onSave(note._id)}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg border-2 transition-all hover:-translate-y-0.5 active:scale-95 ${isSaved
                                    ? 'bg-blue-500 border-blue-500 text-white hover:bg-blue-600'
                                    : 'bg-white border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-500'
                                }`}
                        >
                            {isSaved ? '🔖 Saved' : '🔖 Save'}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default NoteCard;

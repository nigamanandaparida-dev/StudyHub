import React, { useState } from 'react';
import { HiHeart, HiOutlineHeart, HiChatAlt, HiTrash, HiDuplicate } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const MemeCard = ({ meme, onLike, onDelete, onReply, currentUserId }) => {
    const isLiked = meme.likes.includes(currentUserId);
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const textToCopy = meme.postType === 'text' ? (meme.textContent || meme.title) : meme.title;
        if (!textToCopy) return;

        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleReplySubmit = (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        onReply(meme._id, replyText);
        setReplyText('');
        setShowReplyInput(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-6"
        >
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-tr from-brand-green to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {(meme.uploaderName || meme.uploader?.firstName || 'U')[0].toUpperCase()}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900">{meme.uploaderName || meme.uploader?.firstName || 'Anonymous'}</p>
                        <p className="text-xs text-gray-500">{new Date(meme.createdAt).toDateString()}</p>
                    </div>
                </div>
                {currentUserId === meme.uploader && (
                    <button
                        onClick={() => onDelete(meme._id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                        title="Delete Meme"
                    >
                        <HiTrash className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Text Post OR Image Post */}
            {meme.postType === 'text' || !meme.imageUrl ? (
                <div className="bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 px-8 py-10 flex items-center justify-center min-h-[180px]">
                    <p className="text-white text-xl font-bold text-center leading-relaxed">
                        {meme.textContent || meme.title}
                    </p>
                </div>
            ) : (
                <div className="bg-gray-100">
                    <img
                        src={meme.imageUrl?.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL}${meme.imageUrl}` : meme.imageUrl}
                        alt="Meme"
                        className="w-full object-contain max-h-[500px]"
                    />
                    {meme.title && (
                        <p className="px-4 py-2 text-gray-600 text-sm italic">{meme.title}</p>
                    )}
                </div>
            )}

            <div className="p-4 border-t border-gray-50">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex space-x-6">
                        <button
                            onClick={() => onLike(meme._id)}
                            className={`flex items-center space-x-2 transition-colors ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                        >
                            {isLiked ? <HiHeart className="w-7 h-7" /> : <HiOutlineHeart className="w-7 h-7" />}
                            <span className="font-semibold">{meme.likes.length}</span>
                        </button>
                        <button
                            onClick={() => setShowReplyInput(!showReplyInput)}
                            className={`flex items-center space-x-2 transition-colors ${showReplyInput ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'}`}
                        >
                            <HiChatAlt className="w-7 h-7" />
                            <span className="font-semibold">{meme.replies?.length || 0}</span>
                        </button>
                    </div>

                    <button
                        onClick={handleCopy}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-all duration-300 ${copied
                            ? 'bg-green-100 text-green-600'
                            : 'text-gray-500 hover:bg-gray-100 hover:text-blue-600'
                            }`}
                        title="Copy Text"
                    >
                        <HiDuplicate className="w-5 h-5" />
                        <span className="text-xs font-bold">{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                </div>

                <AnimatePresence>
                    {showReplyInput && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            {/* Reply Input Bar */}
                            <form
                                onSubmit={handleReplySubmit}
                                className="mt-4 flex items-center space-x-2"
                            >
                                <input
                                    type="text"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Type your reply..."
                                    className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-600 transition-colors"
                                >
                                    Post
                                </button>
                            </form>

                            {/* Existing Replies List */}
                            {meme.replies?.length > 0 && (
                                <div className="mt-6 space-y-4 pt-4 border-t border-gray-100">
                                    {meme.replies.map((reply, index) => (
                                        <div key={index} className="flex items-start space-x-3">
                                            <div className="w-8 h-8 bg-gradient-to-tr from-gray-200 to-gray-300 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-600">
                                                {(reply.userName || reply.user?.firstName || 'U')[0].toUpperCase()}
                                            </div>
                                            <div className="bg-gray-50 rounded-2xl px-4 py-2 flex-1 relative">
                                                <p className="text-xs font-bold text-gray-800 mb-0.5">
                                                    {reply.userName || reply.user?.firstName || 'Anonymous'}
                                                </p>
                                                <p className="text-sm text-gray-700 leading-relaxed">{reply.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default MemeCard;

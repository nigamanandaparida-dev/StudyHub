import React, { useState, useEffect } from 'react';
import api from '../api';
import MemeCard from '../components/MemeCard';
import { HiEmojiHappy } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const MemeFeed = ({ user, onLoginClick }) => {
    const [memes, setMemes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMemes();
    }, []);

    const fetchMemes = async () => {
        try {
            const { data } = await api.get('/api/memes');
            setMemes(data);
        } catch (error) {
            console.error('Error fetching memes', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (memeId) => {
        if (!user) {
            onLoginClick();
            return;
        }
        try {
            await api.put(`/api/memes/like/${memeId}`, { userId: user.uid });
            fetchMemes();
        } catch (error) {
            console.error('Error liking meme', error);
        }
    };

    const handleDelete = async (memeId) => {
        if (!window.confirm('Are you sure you want to delete this meme?')) return;
        try {
            await api.delete(`/api/memes/${memeId}?userId=${user.uid}`);
            fetchMemes();
        } catch (error) {
            console.error('Error deleting meme', error);
            alert('Failed to delete meme');
        }
    };

    const handleReply = async (memeId, text) => {
        if (!user) {
            onLoginClick();
            return;
        }
        try {
            await api.post(`/api/memes/reply/${memeId}`, {
                userId: user.uid,
                userName: user.displayName || user.email?.split('@')[0],
                text
            });
            fetchMemes();
        } catch (error) {
            console.error('Error replying to meme', error);
            alert('Failed to post reply');
        }
    };

    if (!user && !loading) {
        return (
            <div className="min-h-screen bg-[#12181b] flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] text-center shadow-2xl">
                    <div className="mb-8 relative inline-block">
                        <div className="absolute inset-0 bg-yellow-500/20 blur-2xl rounded-full"></div>
                        <HiEmojiHappy className="text-yellow-500 w-24 h-24 relative animate-bounce" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-white mb-4">
                        Unlock the Fun! 🚀
                    </h2>
                    <p className="text-gray-400 mb-8 leading-relaxed">
                        Join the StudyHub community to view, like, and share the funniest student memes. Verification takes just a second!
                    </p>
                    <button
                        onClick={onLoginClick}
                        className="w-full py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-green-500/20 transform hover:-translate-y-1 transition-all duration-300 active:scale-95"
                    >
                        Login to View Memes
                    </button>
                    <p className="mt-6 text-sm text-gray-500">
                        Don't have an account? <span className="text-blue-400 font-bold cursor-pointer hover:underline" onClick={onLoginClick}>Sign up for free</span>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#12181b] py-10 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-extrabold text-white flex items-center space-x-2">
                        <HiEmojiHappy className="text-yellow-500 w-10 h-10" />
                        <span>Meme Feed</span>
                    </h1>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => {
                                const text = prompt('What\'s on your mind?');
                                if (text) {
                                    api.post('/api/memes/text-post', {
                                        textContent: text,
                                        userId: user?.uid,
                                        uploaderName: user?.displayName || user?.email?.split('@')[0]
                                    }).then(() => fetchMemes());
                                }
                            }}
                            className="bg-emerald-500 text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-emerald-600 transition-colors"
                        >
                            Post Text
                        </button>
                        <Link
                            to="/upload"
                            className="bg-blue-500 text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-blue-600 transition-colors"
                        >
                            Post a Meme
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {memes.map((meme) => (
                            <MemeCard
                                key={meme._id}
                                meme={meme}
                                onLike={handleLike}
                                onDelete={handleDelete}
                                onReply={handleReply}
                                currentUserId={user?.uid}
                            />
                        ))}
                    </div>
                )}

                {!loading && memes.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        <p>No memes yet. Be the first to post one!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MemeFeed;

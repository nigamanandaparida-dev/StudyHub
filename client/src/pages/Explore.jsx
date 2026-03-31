import React, { useState, useEffect } from 'react';
import api, { API_BASE_URL } from '../api';
import NoteCard from '../components/NoteCard';
import { motion } from 'framer-motion';
import { HiSearch } from 'react-icons/hi';

const Explore = ({ user }) => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [savedNotes, setSavedNotes] = useState([]);

    useEffect(() => {
        fetchNotes();
        //    if (user) fetchSavedNotes(); // Assuming user object has saved notes ID or fetch separately
    }, [search]); // Debounce search in real app

    const fetchNotes = async () => {
        try {
            const { data } = await api.get(`/api/notes?search=${search}`);
            setNotes(data);
        } catch (error) {
            console.error('Error fetching notes', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (noteId) => {
        if (!user) return alert('Please login to save notes');
        try {
            await api.put(`/api/notes/save/${noteId}`, { userId: user.uid });
            // Optimistically update or refetch
            fetchNotes(); // Simple refetch for now
        } catch (error) {
            console.error('Error saving note', error);
        }
    };

    const handleOpen = (note) => {
        const url = note.fileUrl?.startsWith('/uploads') ? `${API_BASE_URL}${note.fileUrl}` : note.fileUrl;
        window.open(url, '_blank');
    };

    // Dummy "Best Uploader" logic
    // In real app, calculate from notes count or likes
    const bestUploader = notes.length > 0 ? notes[0].uploader : null;

    return (
        <div className="min-h-screen bg-[#12181b] pt-10 pb-20 px-4 sm:px-6 lg:px-8">

            {/* Best Uploader Highlight */}
            {bestUploader && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-7xl mx-auto mb-12 bg-gradient-to-r from-brand-green to-blue-500 rounded-3xl p-1 shadow-lg"
                >
                    <div className="bg-white rounded-[20px] p-6 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-3xl shadow-md border-4 border-white">
                                👑
                            </div>
                            <div>
                                <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Uploader of the Week</h3>
                                <p className="text-2xl font-bold text-gray-900">{bestUploader.firstName} {bestUploader.lastName}</p>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <span className="text-brand-green font-bold text-lg">Top Contributor</span>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Filter / Search */}
            <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <h1 className="text-3xl font-bold text-white">Explore Notes</h1>

                <div className="relative w-full md:w-96">
                    <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Filter by subject, title..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className=" text-white w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/50 shadow-sm"
                    />
                </div>
            </div>

            {/* Notes Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green"></div>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {notes.map((note) => (
                        <NoteCard
                            key={note._id}
                            note={note}
                            onSave={handleSave}
                            onOpen={handleOpen}
                            isSaved={user && note.savedBy?.includes(user.uid)}
                        />
                    ))}
                </div>
            )}

            {!loading && notes.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    <p className="text-xl">No notes found matching your criteria.</p>
                </div>
            )}
        </div>
    );
};

export default Explore;

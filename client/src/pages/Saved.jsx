import React, { useState, useEffect } from 'react';
import api, { API_BASE_URL } from '../api';
import NoteCard from '../components/NoteCard';
import { HiBookmark } from 'react-icons/hi';

const Saved = ({ user }) => {
    const [savedNotes, setSavedNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchNotes();
        }
    }, [user]);

    const fetchNotes = async () => {
        try {
            // Logic to get ONLY saved notes. 
            // Ideally backend endpoint /api/notes/saved?userId=... 
            // For now, filtering client side from all notes or assume endpoint exists.
            // Let's fetch all and filter for simplicity in this speed-run, or update backend to support it.
            // Actually backend 'api/notes' returns all.
            // I'll filter client side for now.
            const { data } = await api.get('/api/notes');
            const filtered = data.filter(note => note.savedBy?.includes(user.uid));
            setSavedNotes(filtered);
        } catch (error) {
            console.error('Error fetching saved notes', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (noteId) => {
        try {
            await api.put(`/api/notes/save/${noteId}`, { userId: user.uid });
            fetchNotes(); // Refresh list to remove unsaved
        } catch (error) {
            console.error('Error saving note', error);
        }
    };

    const handleOpen = (note) => {
        const url = note.fileUrl?.startsWith('/uploads') ? `${API_BASE_URL}${note.fileUrl}` : note.fileUrl;
        window.open(url, '_blank');
    };

    if (!user) return <div className="text-center py-20">Please login to view saved notes.</div>;

    return (
        <div className="min-h-screen bg-[#12181b] pt-10 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto mb-10 flex items-center space-x-3">
                <div className="bg-brand-green p-2 rounded-lg text-white">
                    <HiBookmark className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold text-white">Your Saved Notes</h1>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green"></div>
                </div>
            ) : savedNotes.length > 0 ? (
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {savedNotes.map((note) => (
                        <NoteCard
                            key={note._id}
                            note={note}
                            onSave={handleSave}
                            onOpen={handleOpen}
                            isSaved={true}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 mb-6">
                        <HiBookmark className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">No Saved Notes Yet</h2>
                    <p className="text-gray-500 max-w-md">
                        It looks like you haven't saved any notes. Explore the community uploads and save the ones that help you study!
                    </p>
                </div>
            )}
        </div>
    );
};

export default Saved;

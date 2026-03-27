import express from 'express';
import User from '../models/User.js';
import Meme from '../models/Meme.js';
import Note from '../models/Note.js';

const router = express.Router();

const ADMIN_PASSWORD = 'GipsyDanger';

// Admin Login  
router.post('/login', (req, res) => { 
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        res.status(200).json({ success: true, message: 'Admin logged in' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid password' });
    }
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// Get all memes
router.get('/memes', async (req, res) => {
    try {
        const memes = await Meme.find().populate('uploader', 'firstName lastName');
        res.json(memes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching memes' });
    }
});

// Get all notes
router.get('/notes', async (req, res) => {
    try {
        const notes = await Note.find().populate('uploader', 'firstName lastName');
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notes' });
    }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
});

// Delete meme
router.delete('/memes/:id', async (req, res) => {
    try {
        await Meme.findByIdAndDelete(req.params.id);
        res.json({ message: 'Meme deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting meme' });
    }
});

// Delete note
router.delete('/notes/:id', async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.json({ message: 'Note deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting note' });
    }
});

export default router;

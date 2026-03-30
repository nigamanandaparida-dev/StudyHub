import express from 'express';
import { db } from '../config/firebase.js';

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
        const snapshot = await db.ref('users').once('value');
        const usersObj = snapshot.val() || {};
        const users = Object.entries(usersObj).map(([id, data]) => ({ id, ...data }));
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// Get all memes
router.get('/memes', async (req, res) => {
    try {
        const snapshot = await db.ref('memes').once('value');
        const memesObj = snapshot.val() || {};
        const memes = Object.values(memesObj);
        res.json(memes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching memes' });
    }
});

// Get all notes
router.get('/notes', async (req, res) => {
    try {
        const snapshot = await db.ref('notes').once('value');
        const notesObj = snapshot.val() || {};
        const notes = Object.values(notesObj);
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notes' });
    }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
    try {
        await db.ref(`users/${req.params.id}`).remove();
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
});

// Delete meme
router.delete('/memes/:id', async (req, res) => {
    try {
        await db.ref(`memes/${req.params.id}`).remove();
        res.json({ message: 'Meme deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting meme' });
    }
});

// Delete note
router.delete('/notes/:id', async (req, res) => {
    try {
        await db.ref(`notes/${req.params.id}`).remove();
        res.json({ message: 'Note deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting note' });
    }
});

export default router;


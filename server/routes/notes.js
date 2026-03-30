import express from 'express';
import { localUpload } from '../utils/localUpload.js';
import { db } from '../config/firebase.js';

const router = express.Router();

// Upload Note
router.post('/upload', localUpload.single('file'), async (req, res) => {
  try {
    const { title, userId, uploaderName } = req.body; 
    const file = req.file;

    if (!file) {
      return res.status(400).send('No file uploaded or file rejected.');
    }
    if (!userId) {
      return res.status(400).json({ message: 'User not authenticated.' });
    }

    const noteData = {
      title,
      fileUrl: `/${file.path.replace(/\\/g, '/')}`, 
      fileType: file.mimetype.split('/')[1] || 'unknown',
      uploader: userId,
      uploaderName: uploaderName || 'Anonymous',
      createdAt: Date.now(),
      savedBy: [] 
    };

    const newNoteRef = db.ref('notes').push();
    await newNoteRef.set({ ...noteData, _id: newNoteRef.key });
    
    res.status(201).json({ ...noteData, _id: newNoteRef.key });
  } catch (error) {
    console.error('--- UPLOAD ERROR (NOTES) ---');
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error during upload', details: error.message });
  }
});

// Get All Notes (with search/filter)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const snapshot = await db.ref('notes').once('value');
    const notesObj = snapshot.val() || {};
    
    let notes = Object.values(notesObj);

    if (search) {
      const searchLower = search.toLowerCase();
      notes = notes.filter(note => note.title?.toLowerCase().includes(searchLower));
    }

    // Sort by createdAt desc
    notes.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes' });
  }
});

// Save/Unsave Note
router.put('/save/:id', async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;

  try {
    const noteRef = db.ref(`notes/${id}`);
    const snapshot = await noteRef.once('value');
    const note = snapshot.val();

    if (!note) return res.status(404).send('No note with that id');

    let savedBy = note.savedBy || [];
    const index = savedBy.indexOf(String(userId));

    if (index === -1) {
      savedBy.push(userId); // Save
    } else {
      savedBy = savedBy.filter((sid) => sid !== String(userId)); // Unsave
    }

    await noteRef.update({ savedBy });
    res.json({ ...note, savedBy });
  } catch (error) {
    res.status(500).json({ message: 'Error saving note' });
  }
});

export default router;


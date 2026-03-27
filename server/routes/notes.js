import express from 'express';
import Note from '../models/Note.js';
import { localUpload } from '../utils/localUpload.js';

const router = express.Router();

// Upload Note
router.post('/upload', localUpload.single('file'), async (req, res) => {
  try {
    const { title, userId, uploaderName } = req.body; 
    console.log('Upload request received:', { title, userId });
    const file = req.file;

    if (!file) {
      console.error('Upload failed: No file processed by multer');
      return res.status(400).send('No file uploaded or file rejected.');
    }
    if (!userId) {
      return res.status(400).json({ message: 'User not authenticated.' });
    }

    const newNote = new Note({
      title,
      fileUrl: `/${file.path.replace(/\\/g, '/')}`, 
      fileType: file.mimetype.split('/')[1] || 'unknown',
      uploader: userId,
      uploaderName: uploaderName || 'Anonymous',
    });

    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    console.error('--- UPLOAD ERROR (NOTES) ---');
    console.error('Error:', error);
    console.error('-----------------------------');
    res.status(500).json({ message: 'Server error during upload', details: error.message });
  }
});

// Get All Notes (with search/filter)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = { title: { $regex: search, $options: 'i' } };
    }
    const notes = await Note.find(query).sort({ createdAt: -1 });
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
    const note = await Note.findById(id);
    if (!note) return res.status(404).send('No note with that id');

    const index = note.savedBy.findIndex((id) => id === String(userId));

    if (index === -1) {
      note.savedBy.push(userId); // Save
    } else {
      note.savedBy = note.savedBy.filter((id) => id !== String(userId)); // Unsave
    }

    const updatedNote = await Note.findByIdAndUpdate(id, note, { new: true });
    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: 'Error saving note' });
  }
});

export default router;

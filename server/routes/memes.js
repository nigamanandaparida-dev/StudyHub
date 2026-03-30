import express from 'express';
import { localUpload } from '../utils/localUpload.js';
import { db } from '../config/firebase.js';

const router = express.Router();

// Upload Meme
router.post('/upload', localUpload.single('image'), async (req, res) => {
  try {
    const { title, userId, uploaderName } = req.body;
    const file = req.file;
    if (!file) {
      return res.status(400).send('No image uploaded.');
    }
    if (!userId) {
      return res.status(400).json({ message: 'User not authenticated.' });
    }

    const memeData = {
      title,
      imageUrl: `/${file.path.replace(/\\/g, '/')}`,
      uploader: userId,
      uploaderName: uploaderName || 'Anonymous',
      postType: 'image',
      createdAt: Date.now(),
      likes: []
    };

    const newMemeRef = db.ref('memes').push();
    await newMemeRef.set({ ...memeData, _id: newMemeRef.key });

    res.status(201).json({ ...memeData, _id: newMemeRef.key });
  } catch (error) {
    console.error('--- UPLOAD ERROR (MEMES) ---');
    console.error('Error:', error);
    res.status(500).json({ message: 'Error uploading meme', details: error.message });
  }
});

// Post Text Message
router.post('/text-post', async (req, res) => {
  try {
    const { textContent, title, userId, uploaderName } = req.body;
    if (!textContent?.trim()) return res.status(400).json({ message: 'Text content is required.' });
    if (!userId) return res.status(400).json({ message: 'User not authenticated.' });

    const postData = {
      title: title || '',
      textContent,
      postType: 'text',
      uploader: userId,
      uploaderName: uploaderName || 'Anonymous',
      createdAt: Date.now(),
      likes: []
    };

    const newMemeRef = db.ref('memes').push();
    await newMemeRef.set({ ...postData, _id: newMemeRef.key });

    res.status(201).json({ ...postData, _id: newMemeRef.key });
  } catch (error) {
    res.status(500).json({ message: 'Error posting text', details: error.message });
  }
});

// Get Memes
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.ref('memes').once('value');
    const memesObj = snapshot.val() || {};
    const memes = Object.values(memesObj).sort((a, b) => b.createdAt - a.createdAt);
    res.json(memes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching memes' });
  }
});

// Like Meme
router.put('/like/:id', async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;

  try {
    if (!userId) return res.status(400).json({ message: 'Unauthenticated' });

    const memeRef = db.ref(`memes/${id}`);
    const snapshot = await memeRef.once('value');
    const meme = snapshot.val();

    if (!meme) return res.status(404).send('No meme with that id');

    let likes = meme.likes || [];
    const index = likes.indexOf(String(userId));

    if (index === -1) {
      likes.push(userId);
    } else {
      likes = likes.filter((l) => l !== String(userId));
    }

    await memeRef.update({ likes });
    res.json({ ...meme, likes });
  } catch (error) {
    res.status(500).json({ message: 'Error liking meme' });
  }
});

// Delete Meme
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const { userId } = req.query; 
    
    try {
        const memeRef = db.ref(`memes/${id}`);
        const snapshot = await memeRef.once('value');
        const meme = snapshot.val();

        if (!meme) return res.status(404).json({ message: 'Meme not found' });

        if (meme.uploader !== userId) {
            return res.status(403).json({ message: 'Unauthorized to delete' });
        }

        await memeRef.remove();
        res.json({ message: 'Meme deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting meme' });
    }
});

// Reply to Meme
router.post('/reply/:id', async (req, res) => {
    const { id } = req.params;
    const { userId, userName, text } = req.body;

    try {
        const memeRef = db.ref(`memes/${id}`);
        const snapshot = await memeRef.once('value');
        const meme = snapshot.val();

        if (!meme) return res.status(404).json({ message: 'Meme not found' });

        const replies = meme.replies || [];
        replies.push({ user: userId, userName: userName || 'Anonymous', text, createdAt: Date.now() });
        
        await memeRef.update({ replies });
        res.status(201).json({ ...meme, replies });
    } catch (error) {
        res.status(500).json({ message: 'Error replying to meme' });
    }
});

export default router;


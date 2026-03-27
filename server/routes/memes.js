import express from 'express';
import Meme from '../models/Meme.js';
import { localUpload } from '../utils/localUpload.js';

const router = express.Router();

// Upload Meme
router.post('/upload', localUpload.single('image'), async (req, res) => {
  try {
    const { title, userId, uploaderName } = req.body;
    const file = req.file;
    if (!file) {
      console.error('Upload failed: No image processed by multer');
      return res.status(400).send('No image uploaded.');
    }
    if (!userId) {
      return res.status(400).json({ message: 'User not authenticated.' });
    }

    const newMeme = new Meme({
      title,
      imageUrl: `/${file.path.replace(/\\/g, '/')}`,
      uploader: userId,
      uploaderName: uploaderName || 'Anonymous',
    });

    await newMeme.save();
    res.status(201).json(newMeme);
  } catch (error) {
    console.error('--- UPLOAD ERROR (MEMES) ---');
    console.error('Error:', error);
    console.error('-----------------------------');
    res.status(500).json({ message: 'Error uploading meme', details: error.message });
  }
});

// Post Text Message
router.post('/text-post', async (req, res) => {
  try {
    const { textContent, title, userId, uploaderName } = req.body;
    if (!textContent?.trim()) return res.status(400).json({ message: 'Text content is required.' });
    if (!userId) return res.status(400).json({ message: 'User not authenticated.' });

    const newPost = new Meme({
      title: title || '',
      textContent,
      postType: 'text',
      uploader: userId,
      uploaderName: uploaderName || 'Anonymous',
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Error posting text', details: error.message });
  }
});

// Get Memes
router.get('/', async (req, res) => {
  try {
    const memes = await Meme.find().sort({ createdAt: -1 });
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

    const meme = await Meme.findById(id);
    if (!meme) return res.status(404).send('No meme with that id');

    const index = meme.likes.findIndex((id) => id === String(userId));

    if (index === -1) {
      meme.likes.push(userId);
    } else {
      meme.likes = meme.likes.filter((id) => id !== String(userId));
    }

    const updatedMeme = await Meme.findByIdAndUpdate(id, meme, { new: true });
    res.json(updatedMeme);
  } catch (error) {
    res.status(500).json({ message: 'Error liking meme' });
  }
});

// Delete Meme
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const { userId } = req.query; // Usually delete might use query or we can keep body if needed, but fetch DELETE often uses query. Let's use body for consistency if req.body is available in DELETE (Express supports it)
    
    // Actually, let's use query for userId to be safe with all clients, or better, headers. 
    // But since the project seems to use req.body for userId in PUT, I'll try to stick to that if possible, 
    // though DELETE with body is sometimes problematic for some clients. 
    // Let's check how they do it. The user didn't specify. I'll use query for DELETE.
    
    try {
        const meme = await Meme.findById(id);
        if (!meme) return res.status(404).json({ message: 'Meme not found' });

        if (meme.uploader.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized to delete' });
        }

        await Meme.findByIdAndDelete(id);
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
        const meme = await Meme.findById(id);
        if (!meme) return res.status(404).json({ message: 'Meme not found' });

        meme.replies.push({ user: userId, userName: userName || 'Anonymous', text });
        await meme.save();

        const updatedMeme = await Meme.findById(id);
        res.status(201).json(updatedMeme);
    } catch (error) {
        res.status(500).json({ message: 'Error replying to meme' });
    }
});

export default router;

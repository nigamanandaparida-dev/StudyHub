import express from 'express';
import { sendOTP } from '../utils/email.js';
import { db } from '../config/firebase.js';

const router = express.Router();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Request OTP for Registration
router.post('/request-otp', async (req, res) => {
  try {
    const { email } = req.body;
    const otp = generateOTP();
    
    // Save OTP to Realtime Database
    // We use a sanitized version of the email as the key or just a push ID
    const sanitizedEmail = email.replace(/[.$#[\]]/g, '_'); 
    
    await db.ref(`otps/${sanitizedEmail}`).set({
      otp,
      isVerified: false,
      createdAt: Date.now()
    });

    try {
      const { previewUrl } = await sendOTP(email, otp);
      res.status(200).json({ 
        message: 'Verification code sent to your email.',
        previewUrl 
      });
    } catch (mailError) {
      res.status(500).json({ message: 'Failed to send verification email.', error: mailError.message });
    }
  } catch (error) {
    console.error('❌ AUTH ERROR (request-otp):', error);
    res.status(500).json({ 
      message: 'Server failed to process OTP request', 
      error: error.message
    });
  }
});

// Verify OTP for Registration
router.post('/verify-otp-registration', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const sanitizedEmail = email.replace(/[.$#[\]]/g, '_');
    
    const snapshot = await db.ref(`otps/${sanitizedEmail}`).get();
    const otpRecord = snapshot.val();

    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Mark as verified
    await db.ref(`otps/${sanitizedEmail}`).update({ isVerified: true });

    res.status(200).json({ message: 'Email verified successfully. Please complete your registration.' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong during verification' });
    console.error(error);
  }
});

// Note: The client handles final Firebase registration directly.
// The /register and /login routes are no longer needed on the server 
// if you are using Firebase Auth on the client side.

export default router;
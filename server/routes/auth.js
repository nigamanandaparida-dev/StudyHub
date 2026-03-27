import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import OTP from '../models/OTP.js';
import { sendOTP } from '../utils/email.js';

const router = express.Router();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Request OTP for Registration
router.post('/request-otp', async (req, res) => {
  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const otp = generateOTP();
    
    // Save or update OTP record
    await OTP.findOneAndUpdate(
      { email },
      { otp, isVerified: false, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    try {
      const { previewUrl } = await sendOTP(email, otp);
      res.status(200).json({ 
        message: 'Verification code sent to your email.',
        previewUrl 
      });
    } catch (mailError) {
      res.status(500).json({ message: 'Failed to send verification email. Please try again.', error: mailError.message });
    }
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
    console.error(error);
  }
});

// Verify OTP for Registration
router.post('/verify-otp-registration', async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) return res.status(400).json({ message: 'Invalid or expired OTP' });

    otpRecord.isVerified = true;
    await otpRecord.save();

    res.status(200).json({ message: 'Email verified successfully. Please complete your registration.' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong during verification' });
    console.error(error);
  }
});

// Final Registration
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if email was verified via OTP
    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord || !otpRecord.isVerified) {
      return res.status(400).json({ message: 'Please verify your email address first.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      isVerified: true // Set to true because they verified the OTP first
    });

    await newUser.save();
    
    // Cleanup OTP record
    await OTP.deleteOne({ email });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ result: newUser, token, message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
    console.error(error);
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) return res.status(404).json({ message: 'User not found' });

    // Handle legacy unverified users OR re-verify if needed
    if (!existingUser.isVerified) {
      // For legacy/unverified, they can use the same flow or we can send them to verify-otp-registration
      return res.status(403).json({ message: 'Your account is not verified. Please register again to verify your email.', email, unverified: true });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
    console.error(error);
  }
});

export default router;
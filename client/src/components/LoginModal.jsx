import React, { useState } from 'react';
import { HiX } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import api from '../api';

const LoginModal = ({ isOpen, onClose, onLogin, onRegister, onGoogleSignIn }) => {
    const [mode, setMode] = useState('login'); // 'login', 'register', 'verify'
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });
    const [otpCode, setOtpCode] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (mode === 'login') {
            await onLogin(formData.email, formData.password);

        } else if (mode === 'register') {
            // Call backend to send OTP email
            setIsLoading(true);
            try {
                const res = await api.post('/api/auth/request-otp', {
                    email: formData.email
                });
                // previewUrl is the Ethereal email link (scannable by Google Lens!)
                setPreviewUrl(res.data.previewUrl || '');
                setMode('verify');
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to send verification email.');
            } finally {
                setIsLoading(false);
            }

        } else if (mode === 'verify') {
            // Verify OTP, then register
            setIsLoading(true);
            try {
                await api.post('/api/auth/verify-otp-registration', {
                    email: formData.email,
                    otp: otpCode
                });
                // OTP verified — now register with Firebase
                await onRegister(formData);
            } catch (err) {
                setError(err.response?.data?.message || 'Invalid or expired code. Please try again.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleMode = () => {
        setMode(mode === 'login' ? 'register' : 'login');
        setError('');
    };

    const renderFields = () => {
        if (mode === 'verify') {
            return (
                <div className="flex flex-col items-center space-y-4">
                    {previewUrl ? (
                        <>
                            <p className="text-sm text-gray-600 text-center">
                                📱 <strong>Scan the QR code with Google Lens</strong> to open your verification email, then enter the 6-digit code below.
                            </p>
                            <div className="bg-white p-3 rounded-xl shadow border border-gray-100">
                                <QRCodeSVG value={previewUrl} size={170} />
                            </div>
                            <a
                                href={previewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-500 hover:underline"
                            >
                                Or click here to open the email preview
                            </a>
                        </>
                    ) : (
                        <p className="text-sm text-gray-600 text-center">
                            A verification code was sent to <strong>{formData.email}</strong>. Enter it below.
                        </p>
                    )}

                    <div className="w-full space-y-2">
                        <label className="text-sm font-medium text-gray-700">Verification Code</label>
                        <input
                            type="text"
                            placeholder="Enter 6-digit code"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all text-center tracking-widest font-mono text-xl"
                            required
                        />
                        {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                    </div>
                </div>
            );
        }

        return (
            <>
                {mode === 'register' && (
                    <div className="flex space-x-4">
                        <div className="space-y-2 w-1/2">
                            <label className="text-sm font-medium text-gray-700">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="John"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-2 w-1/2">
                            <label className="text-sm font-medium text-gray-700">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Doe"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all"
                                required
                            />
                        </div>
                    </div>
                )}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="student@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all"
                        required
                        minLength={6}
                    />
                </div>
                {error && <p className="text-red-500 text-xs text-center">{error}</p>}
            </>
        );
    };

    const getTitle = () => {
        if (mode === 'verify') return 'Verify Your Email';
        if (mode === 'register') return 'Create Your Account';
        return 'Welcome Back';
    };

    const getButtonText = () => {
        if (isLoading) return 'Please wait...';
        if (mode === 'verify') return 'Verify & Sign Up';
        if (mode === 'register') return 'Send Verification Code';
        return 'Log In';
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative border border-white/20"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-6 left-6 text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 rounded-full p-1"
                    >
                        <HiX className="w-5 h-5" />
                    </button>

                    <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
                        {getTitle()}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {renderFields()}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 active:scale-95 disabled:opacity-60 disabled:pointer-events-none"
                        >
                            {getButtonText()}
                        </button>
                    </form>

                    {mode === 'verify' && (
                        <div className="text-center mt-4">
                            <button
                                type="button"
                                onClick={() => { setMode('register'); setError(''); setPreviewUrl(''); }}
                                className="text-sm text-gray-500 hover:text-gray-700 underline"
                            >
                                ← Go back
                            </button>
                        </div>
                    )}

                    {mode !== 'verify' && (
                        <>
                            <div className="mt-4 flex items-center mb-4">
                                <div className="flex-grow border-t border-gray-300"></div>
                                <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">or</span>
                                <div className="flex-grow border-t border-gray-300"></div>
                            </div>

                            <button
                                onClick={onGoogleSignIn}
                                type="button"
                                className="w-full flex justify-center items-center py-3 bg-white border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
                            >
                                <img className="h-5 w-5 mr-2" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google logo" />
                                Sign in with Google
                            </button>

                            <p className="text-center mt-6 text-gray-500 text-sm">
                                {mode === 'register' ? 'Already have an account?' : "Don't have an account?"}{' '}
                                <button
                                    onClick={toggleMode}
                                    type="button"
                                    className="text-blue-600 font-bold hover:underline ml-1"
                                >
                                    {mode === 'register' ? 'Log in' : 'Sign up for free'}
                                </button>
                            </p>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default LoginModal;

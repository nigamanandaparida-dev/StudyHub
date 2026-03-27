import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiLockClosed, HiX } from 'react-icons/hi';

const AdminLogin = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/login`, { password });
            if (data.success) {
                localStorage.setItem('isAdmin', 'true');
                navigate('/admin-dashboard');
            }
        } catch (err) {
            setError('Invalid Admin Password');
        }
    };

    return (
        <div className="min-h-screen bg-[#12181b] flex items-center justify-center px-4 relative">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 relative"
            >
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <HiX className="w-6 h-6" />
                </button>
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                        <HiLockClosed className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Access</h1>
                    <p className="text-gray-500 text-sm">Enter the security password to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Admin Password"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transform hover:scale-[1.02] transition-all shadow-lg"
                    >
                        Authenticate
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLogin;

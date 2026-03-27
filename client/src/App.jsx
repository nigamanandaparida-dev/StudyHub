import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Explore from './pages/Explore';
import Saved from './pages/Saved';
import MemeFeed from './pages/MemeFeed';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { auth, database } from './firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';

function App() {
  const [user, setUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen to Firebase authn state changes natively
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const baseUser = {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        };
        setUser(baseUser);

        // Fetch additional profile data from Realtime DB
        get(ref(database, 'users/' + currentUser.uid)).then((snapshot) => {
          if (snapshot.exists()) {
            const dbData = snapshot.val();
            setUser(prev => ({
              ...prev,
              firstName: dbData.firstName,
              lastName: dbData.lastName,
              displayName: prev?.displayName || `${dbData.firstName} ${dbData.lastName || ''}`.trim()
            }));
          }
        }).catch(err => console.error("Profile enrichment error:", err));
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoginModalOpen(false);
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  const handleRegister = async (formData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const newUser = userCredential.user;

      // Update Profile Name in Firebase Auth immediately
      await updateProfile(newUser, {
        displayName: `${formData.firstName} ${formData.lastName}`
      });

      // Save additional profile data like First/Last Name to Firebase Realtime DB
      await set(ref(database, 'users/' + newUser.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        createdAt: new Date().toISOString()
      });

      setIsLoginModalOpen(false);
    } catch (error) {
      alert('Registration failed: ' + error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;

      // Update their profile in real-time DB just in case! 
      await set(ref(database, 'users/' + googleUser.uid), {
        firstName: googleUser.displayName?.split(' ')[0] || '',
        lastName: googleUser.displayName?.split(' ').slice(1).join(' ') || '',
        email: googleUser.email,
        photoURL: googleUser.photoURL,
        createdAt: new Date().toISOString()
      });

      setIsLoginModalOpen(false);
    } catch (error) {
      if (error.code !== 'auth/popup-closed-by-user') {
        alert('Google Sign-In failed: ' + error.message);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      alert('Logout failed: ' + error.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar
        isAuthenticated={!!user}
        user={user}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Home />} /> {/* Link to Home for now */}
          <Route path="/upload" element={user ? <Upload user={user} /> : <div className="text-center py-20 text-red-500">Please login to upload</div>} />
          <Route path="/explore" element={<Explore user={user} />} />
          <Route path="/saved" element={<Saved user={user} />} />
          <Route path="/memes" element={<MemeFeed user={user} onLoginClick={() => setIsLoginModalOpen(true)} />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>

      <Footer />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onGoogleSignIn={handleGoogleSignIn}
      />
    </div>
  );
}

export default App;

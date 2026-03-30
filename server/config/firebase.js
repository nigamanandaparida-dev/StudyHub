import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;
const databaseURL = process.env.FIREBASE_DATABASE_URL;

if (!admin.apps.length) {
    if (serviceAccountString && databaseURL) {
        try {
            const serviceAccount = JSON.parse(serviceAccountString);
            if (serviceAccount.private_key) {
                serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
            }
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                databaseURL: databaseURL
            });
            console.log('✅ Firebase Admin initialized successfully');
        } catch (parseError) {
            console.error('❌ CRITICAL: Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:', parseError.message);
        }
    } else {
        console.warn('⚠️ WARNING: Missing FIREBASE_SERVICE_ACCOUNT or FIREBASE_DATABASE_URL.');
    }
}

let dbInstance = null;

export const db = {
    get ref() {
        if (!admin.apps.length) {
            console.error('❌ ERROR: Firebase Admin not initialized. Check your environment variables.');
            throw new Error('Firebase Admin not initialized');
        }
        if (!dbInstance) dbInstance = admin.database();
        return dbInstance.ref.bind(dbInstance);
    }
};

export default admin;

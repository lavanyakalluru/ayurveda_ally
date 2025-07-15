import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyC7qAFGAAY6DnAKg_WXgRlkKAJO21GMUNA",
  authDomain: "ayurveda-14136.firebaseapp.com",
  projectId: "ayurveda-14136",
  storageBucket: "ayurveda-14136.appspot.com",
  messagingSenderId: "915972474735",
  appId: "1:915972474735:web:337f08733612076467ca9a",
  measurementId: "G-MFVS0FEZ1Y"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Analytics (only on client)
let analytics: ReturnType<typeof getAnalytics> | undefined = undefined;
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) analytics = getAnalytics(app);
  });
}

export { app, auth, db, analytics };  
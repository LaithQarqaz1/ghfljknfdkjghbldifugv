import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDFW9Qau397Hy4E1HTUwyfSu9NIFDSfRXs",
  authDomain: "laithstore.firebaseapp.com",
  projectId: "laithstore",
  storageBucket: "laithstore.appspot.com",
  messagingSenderId: "1000701670996",
  appId: "1:1000701670996:web:995ade1612f62c2f645fc1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
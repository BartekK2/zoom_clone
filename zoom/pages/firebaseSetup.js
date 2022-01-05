import { getFirestore } from '@firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD7rk9gUZhOxVAI_M60nqDcDxkpoObftdM",
    authDomain: "test-36302.firebaseapp.com",
    projectId: "test-36302",
    storageBucket: "test-36302.appspot.com",
    messagingSenderId: "537914014889",
    appId: "1:537914014889:web:efd2bd04f2eb48a262bdb8"
};

const app = initializeApp(firebaseConfig);

export default app;
export const auth = getAuth(app);
export const db = getFirestore(app)
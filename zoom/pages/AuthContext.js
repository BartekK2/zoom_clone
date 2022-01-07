import React, { useContext, useState, useEffect } from "react"
import { auth } from "./firebaseSetup"
import {
    onAuthStateChanged, signOut,
    signInWithEmailAndPassword, createUserWithEmailAndPassword,
    sendPasswordResetEmail, updateEmail, updatePassword,
    setPersistence, browserLocalPersistence, browserSessionPersistence,
    GoogleAuthProvider, signInWithPopup, signInWithRedirect, FacebookAuthProvider,
    GithubAuthProvider

} from "firebase/auth";
import { collection, getDocs, getDoc, query, where, addDoc } from "firebase/firestore";
import { db } from "./firebaseSetup";
import fetch from 'node-fetch';

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const githubProvider = new GithubAuthProvider();

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

    function setAuthPersistence(local) {
        local ? setPersistence(auth, browserLocalPersistence) : setPersistence(auth, browserSessionPersistence);
    }

    function getPersistence() {
        return auth.persistenceManager.persistence.type;
    }

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    function logout() {
        return signOut(auth)
    }

    function googleSignInWithPopUp() {
        signInWithPopup(auth, googleProvider);
    }

    function googleSignInWithRedirect() {
        signInWithRedirect(auth, googleProvider);
    }

    function facebookSignInWithPopUp() {
        signInWithPopup(auth, facebookProvider);
    }

    function facebookSignInWithRedirect() {
        signInWithRedirect(auth, facebookProvider);
    }

    const roomsRef = collection(db, "rooms");

    async function passwordCheck(uid, id, password) {
        await fetch('https://europe-central2-test-36302.cloudfunctions.net/passwordCheck', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "uid": uid, "id": id, "password": password })
        })
    }

    async function getRooms(uid) {
        let rooms;
        await fetch('https://europe-central2-test-36302.cloudfunctions.net/rooms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "uid": uid })
        }).then(response => response.json())
            .then(data => { rooms = data });;
        return rooms;
    }
    async function addRoom(uid, _name, is_secured, pass) {
        await addDoc(collection(db, "rooms"), {
            creator_uid: uid,
            name: _name,
            secured: is_secured,
            password: pass,
        }).then(async (doc) => await passwordCheck(uid, doc.id, pass));
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)
            setLoading(false)
        })

        return unsubscribe
    }, [])

    const signin = login;


    const value = {
        currentUser,
        signin,
        signup,
        logout,
        getRooms,
        addRoom,
        setAuthPersistence,
        getPersistence,
        googleSignInWithPopUp,
        googleSignInWithRedirect,
        facebookSignInWithPopUp,
        facebookSignInWithRedirect
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
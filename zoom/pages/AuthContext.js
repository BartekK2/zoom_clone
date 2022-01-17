import React, { useContext, useState, useEffect } from "react"
import { auth } from "../firebaseSetup"
import {
    onAuthStateChanged, signOut,
    signInWithEmailAndPassword, createUserWithEmailAndPassword,
    sendPasswordResetEmail, updateEmail, updatePassword,
    setPersistence, browserLocalPersistence, browserSessionPersistence,
    GoogleAuthProvider, signInWithPopup, signInWithRedirect, FacebookAuthProvider,
    GithubAuthProvider

} from "firebase/auth";
import { collection, getDocs, getDoc, query, where, addDoc } from "firebase/firestore";
import { db } from "../firebaseSetup";
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

    async function getRooms(uid) {
        let rooms;
        await fetch('https://europe-central2-test-36302.cloudfunctions.net/rooms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "uid": uid })
        }).then(response => {
            return response.json().catch(err => {
                return [];
            });
        })
            .then(data => { rooms = data });;
        return rooms;
    }


    async function addRoom(uid, _name, pass) {
        await fetch('https://europe-central2-test-36302.cloudfunctions.net/addRoom', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "uid": uid, "name": _name, "password": pass })
        }).then(response => {
            return response.status;
        })
    }

    async function joinRoom(uid, name, pass) {
        await fetch('https://europe-central2-test-36302.cloudfunctions.net/joinroom', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "uid": uid, "name": name, "password": pass })
        }).then(response => {
            return response.status;
        })
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
        joinRoom,
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

export default AuthProvider;
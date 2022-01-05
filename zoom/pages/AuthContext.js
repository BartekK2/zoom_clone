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
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";


import { db } from "./firebaseSetup";

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
        const q = query(roomsRef, where("creator_uid", "==", uid));
        const rooms = await getDocs(q);
        let returned_rooms = [];
        rooms.forEach(element => {
            returned_rooms.push(element.data());
        });
        console.log(returned_rooms);
        return returned_rooms;
    }
    async function addRoom(e, uid, _name, is_secured, pass) {
        e.preventDefault()

        await addDoc(collection(db, "rooms"), {
            creator_uid: uid,
            name: _name,
            secured: is_secured,
            password: pass,
        });
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
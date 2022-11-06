import React from "react";
import { useContext, createContext, useEffect, useState} from "react";
import { auth } from "../firebase";
 
import { 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut, 
    // signInWithRedirect,
    onAuthStateChanged
} from "firebase/auth";

const AuthContext = createContext();

export const AuthContextProvider = ( {children} ) => {

    const [user, setUser] = useState({});

    const googleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider);
    };

    const logOut = () => {
        signOut(auth);
    }

    useEffect(()=> {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
        });
        return () => {
            unsubscribe();
        }
    }, [user])
    
    return (
        <AuthContext.Provider value = {{googleSignIn, logOut, user}}>
            {children}
        </AuthContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(AuthContext)
}

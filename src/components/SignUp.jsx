import React from 'react';

import { GoogleButton } from "react-google-button";
import { UserAuth } from "../contexts/AuthContext";

export default function SignUp() {

    const {googleSignIn} = UserAuth();

    const handleGoogleSignIn = async () => {
        try {
            await googleSignIn();
        } 
        catch (err){
            console.log(err);
        }
    }

    return (
        <section id ="login-container"> 
            <h2>Sign Up or Sign In</h2>
            <GoogleButton onClick = {handleGoogleSignIn}/>
        </section>
    )
}
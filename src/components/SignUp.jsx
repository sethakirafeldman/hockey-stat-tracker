import React from 'react';

import { GoogleButton } from "react-google-button";
import { UserAuth } from "../contexts/AuthContext";

import {Typography, Box} from '@mui/material';

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
        <>
        <img id = "ice-img" alt = "skater on ice rink" src= "https://source.unsplash.com/XUwk3DG6jqg"/>
        <section id ="login-container"> 
            <div className = "login-area">
            <Typography sx = {{pb:4}} variant = "h4">Welcome to Stat Tracker</Typography>
            <Typography sx = {{pb:4}} variant = "h5">Track your personal stats for beer league and beyond.</Typography>
                <Typography sx = {{mb:4}} variant ="body">Get started by siging up or signing in below</Typography>
                <Box sx = {{pt:4}}>
                    <GoogleButton onClick = {handleGoogleSignIn}/>
                </Box>
            </div>
        </section>
        </>
    )
}
import React from 'react';

import { GoogleButton } from "react-google-button";
import { UserAuth } from "../contexts/AuthContext";

import { Paper, Typography, Box, Card} from '@mui/material';

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
        
        <Paper elevation = {0}>
        <section id ="login-container"> 
        <img id = "ice-img" alt = "ice rink" src= "https://source.unsplash.com/XUwk3DG6jqg"/>
            <div class = "login-area">
            <Typography sx = {{pb:4}} variant = "h4">Welcome to Stat Tracker</Typography>
            <Typography sx = {{pb:4}} variant = "h5">Track your personal stats for beer league and beyond.</Typography>
            {/* <Card className = "" sx ={{minHeight: 250}}> */}
                <Typography sx = {{pb:4}} variant ="body">Get started by siging up or signing in below</Typography>
                <GoogleButton onClick = {handleGoogleSignIn}/>
            {/* </Card> */}
            </div>
        </section>
        </Paper>

        </>
    )
}
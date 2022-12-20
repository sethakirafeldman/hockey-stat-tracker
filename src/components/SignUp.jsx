import React, {useState} from 'react';
import homePage from "../assets/homepage.jpg";

import { GoogleButton } from "react-google-button";
import { UserAuth } from "../contexts/AuthContext";

//mui
import {Typography, Box, Paper} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

export default function SignUp({user}) {

    const {googleSignIn} = UserAuth();
    const [imageLoad, setImageLoad] = useState(false);

    const handleGoogleSignIn = async () => {
        try {
            await googleSignIn();
            // setSignedIn(true);
        } 
        catch (err){
            console.log(err);
        }
    }

    const showImg = () => {
        setImageLoad(true);
    }
    return (
        <>
        {!user ?
        <Box sx ={{textAlign:'left'}}>

            <img 
                className = {`background-transition image-${imageLoad ? 'visible' : 'hidden'}`}
                id = "ice-img" 
                alt = "skater on ice rink" 
                loading="lazy" 
                src= {homePage} 
                onLoad = {showImg}
                backgroundColor = "black"
            />

            <Paper className = {`background-transition image-${imageLoad ? 'visible' : 'hidden'}`} elevation = {6} sx= {{position:'fixed',top: '50%', left: '50%', transform:"translate(-50%, -50%)", padding: 2, backgroundColor: "transparent"}}>
            <Typography sx = {{pb: 4 }} variant = "h4">Welcome to Stat Tracker</Typography>
            <Typography sx = {{pb: 4}} variant = "h5">Track your personal hockey stats for beer league and beyond.</Typography>
                <Typography sx = {{mb:4, fontSize: '1.5em'}} variant ="body">Get started by signing up or signing in below.</Typography>
                <Box sx = {{pt:4}}>
                    <GoogleButton onClick = {handleGoogleSignIn}/>
                </Box>
            </Paper>

        </Box>
        :
        <Box sx ={{display: 'flex', justifyContent:'center', alignItems:'center'}}>
        <CircularProgress  />
        </Box>
        }
        </>
    )
}
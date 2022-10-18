import React from 'react';
import { TextField, Button, ButtonGroup } from '@mui/material';

import { GoogleButton } from "react-google-button";
import { UserAuth } from "../contexts/AuthContext";

export default function SignUp() {

    const {googleSignIn} = UserAuth();

    const handleGoogleSignIn = async () => {
        try {
            await googleSignIn()
        } catch (err){
            console.log(err);
        }
    }

    return (
        <section id ="login-container"> 
        <h2>Sign Up</h2>
        {/* <TextField id="outlined-basic" label="Username" variant="outlined" required  />
        <TextField id="outlined-basic" label="Password" variant="outlined" required type ="password"  />
        <TextField id="outlined-basic" label="Confirm Password" variant="outlined" required type ="password"  /> */}

        <GoogleButton onClick = {handleGoogleSignIn}/>
        {/* <ButtonGroup variant="outlined" aria-label="outlined primary button group">
            <Button color ="primary">Register</Button>
            <Button color ="secondary">Cancel</Button>
        </ButtonGroup> */}
        </section>
    )
}
import React from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';

import {UserAuth} from '../contexts/AuthContext';

export default function NavBar() {

    const {user, logOut} = UserAuth();
    const handleSignOut = async () =>{
        try {
            await logOut()
        }
        catch (err) {
            console.log(err);
        }
    }
    return(
    <AppBar position="static" sx ={{bgcolor: "darkblue"}}>
        <Toolbar>
            <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}>
        </IconButton>
        {user ? 
        <div id ="profile-items">
            <Avatar src = {user.photoURL}/>
            <h3>{user.displayName}</h3>
            <Button variant ="contained" onClick = {handleSignOut} color = "primary"> Log Out </Button>
        </div> :
        <h3>You are not logged in</h3>
        }
       

        </Toolbar>
    </AppBar>
    )
}
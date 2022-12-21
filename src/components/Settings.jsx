import React from 'react';
import { Card, Typography, CardContent, Box } from '@mui/material';

import {UserAuth} from '../contexts/AuthContext';

export default function Settings () {
    const {user} = UserAuth();

    return (
        // {user ?
        <Box className = {`fade-in`}>    
        <Typography variant="h4" gutterBottom sx = {{mt: 2}}>Settings</Typography>
        <Box display ="flex"  alignItems="center" justifyContent="center" sx = {{minWidth: 275}}>
        {user ?
        <Card variant = "outlined" sx={{ minWidth: 275, textAlign: "center" }}>
        <CardContent>
        <img alt = {user.displayName} src = {user.photoURL}></img>
        <Typography sx={{ fontSize: 16 }} color="text.primary" gutterBottom>
            {user.displayName}
        </Typography>
        <Typography>
            {user.email}
        </Typography>
        <Typography>
            Auth data provided by {user.providerData[0].providerId}
        </Typography>
        {' '}
        <Typography>
        Account deletion and data export coming soon!
        </Typography>
        </CardContent>
        </Card>
        :
        <>
        {document.location.href = "/"}
        </>
        }
        </Box>
        {/* //    :
        //    null */}
        </Box>    
     )    
}
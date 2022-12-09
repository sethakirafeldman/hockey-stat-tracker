import React from 'react';
import StatEntry from "./StatEntry";
import RealTimeList from "./RealTimeList";

import {Box, Typography, Paper } from '@mui/material';

export default function Dashboard({activeUser, currentDate, realTimeCallBack}) {
   
    return (
        <>
        <Box sx = {{flexDirection: 'column', alignItems:"center", justifyContent:"center"}}>
        <Paper 
            elevation = {3} 
            square 
            sx = {{p:2, m:2, mt:2, mb: 2, borderRadius: 1, borderColor:"primary.main", borderWidth: 2, width: "50%", margin: 'auto'}}
        >
            <Typography variant = 'body' type = "center">
            <Typography variant="h4" gutterBottom sx = {{mt: 2}}>Dashboard</Typography>

                {activeUser.name ? 
                <>
                <h3>{`Welcome, ${activeUser.name}.`}</h3> 
                <p>This is your dashboard. It gives you a place where you may enter your stats. You can always go back and edit afterwards.</p>
                </>
                :
                null
                }
            </Typography>
            </Paper>
            <StatEntry activeUser = {activeUser} currentDate = {currentDate}  />
            <RealTimeList activeUser = {activeUser} realTimeCallBack = {realTimeCallBack} />
        
         </Box>
        </>
    )
}
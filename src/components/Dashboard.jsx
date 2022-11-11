import React from 'react';
import StatEntry from "./StatEntry";
import RealTimeList from "./RealTimeList";

import {Box, Typography } from '@mui/material';

export default function Dashboard(props) {
   
    // at dashboard level, get player_id from users table
    // pass in as props to StatEntry and PointHistory   
    return (
        <>
        <Box sx = {{flexDirection: 'column'}}>
            <Typography variant = 'body' type = "center">
            <Typography variant="h4" gutterBottom sx = {{mt: 2}}>Dashboard</Typography>

                { props.activeUser.name ? 
                <>
                {' '}
                <h3>{`Welcome, ${props.activeUser.name}.`}</h3> 
                <div className ="text-area">
                <p>This is your dashboard. It gives you a place where you may enter your stats. You can always go back and edit afterwards.</p>
                </div>
                </>
                :
                null
                }
            </Typography>
            <StatEntry activeUser = {props.activeUser} currentDate = {props.currentDate}  />
            <RealTimeList activeUser = {props.activeUser} realTimeCallBack = {props.realTimeCallBack} />
         </Box>
        </>
    )
}
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
                <h2>Dashboard</h2>
                { props.activeUser.name ? 
                <>
                {' '}
                <h3>{`Welcome, ${props.activeUser.name}.`}</h3> 
                <p>This is your dashboard. It gives you a place where you may enter your stats. You can always go back and edit afterwards.</p>
                </>
                :
                null
                }
            </Typography>
            <StatEntry activeUser = {props.activeUser} />
            <RealTimeList activeUser = {props.activeUser} />
         </Box>
        </>
    )
}
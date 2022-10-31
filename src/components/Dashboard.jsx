import React from 'react';
import StatEntry from "./StatEntry";
import RealTimeList from "./RealTimeList";

import Box from '@mui/material/Box';


export default function Dashboard(props) {
    // at dashboard level, get player_id from users table
    // pass in as props to StatEntry and PointHistory   
    return (
        <>
        <Box sx = {{flexDirection: 'column'}}>
            <p>Welcome, {props.activeUser.name}</p>
            <StatEntry activeUser = {props.activeUser} />
            <RealTimeList activeUser = {props.activeUser} />
         </Box>
        </>
    )
}
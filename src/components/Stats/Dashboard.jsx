import React from 'react';
import StatEntry from "./StatEntry";
import StatDisplay from "./StatDisplay";
import Link from '@mui/material/Link';

import {Box, Typography, Paper } from '@mui/material';

export default function Dashboard({activeUser, currentDate, realTimeCallBack}) {
   
    

    return (
        <>
        <Box 
            className = {`fade-in`}
            sx = {{flexDirection: 'column', alignItems:"center", justifyContent:"center"}}>
           
        <Paper 
            elevation = {3} 
            square 
            sx = {{p:2, m:2, mt:2, mb: 2, textAlign:'left', borderRadius: 1, borderColor:"primary.main", borderWidth: 2, width: "50%", margin: 'auto'}}
        >
            <Typography variant = 'body' sx = {{textAlign:'center'}}>
            <Typography variant="h4" gutterBottom sx = {{mt: 2, textAlign:'center'}}>Dashboard</Typography>

                {activeUser.name ? 
                <>
                <Typography variant = 'h5' sx ={{m:2}}>{`Welcome, ${activeUser.name}.`}</Typography> 
                <Typography variant = 'body' sx ={{lineHeight: 1.5}}>This is your dashboard. It gives you a place where you may enter your stats for your games. 
                You can always go back and edit afterwards. 
                The data entered here will be used for data visualization on the <Link href="/graphs">graphs</Link> page.</Typography>
                </>
                :
                null
                }
            </Typography>
            </Paper>
            <StatEntry activeUser = {activeUser} />
            <StatDisplay activeUser = {activeUser} realTimeCallBack = {realTimeCallBack} />
        
         </Box>
        </>
    )
}
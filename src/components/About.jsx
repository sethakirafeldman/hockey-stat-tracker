import React from 'react';

//mui
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';

export default function About() {
    return (
    <section className = "text-area">
        {' '}
        <Typography variant="h4" gutterBottom sx = {{mt: 2}}>About</Typography>
        <Typography sx = {{}} variant="body1" gutterBottom>
            This site was built by Seth Feldman. 
            It was built as a tool for me (Seth) and 
            his friends to use in order to track
            stats in their adult hockey league.  

            It was built using a number of libraries 
            including <Link href ="https://mui.com/" target="_blank" rel="noopener">MUI</Link>, 
            {' '}<Link href = "https://reactjs.org/" target="_blank" rel="noopener">React</Link>,  
            {' '}<Link href="https://reactrouter.com/" target="_blank" rel="noopener">React Router</Link>, 
            and it uses <Link href="https://firebase.google.com/" target="_blank" rel="noopener">Firebase</Link>
            {' '}for its backend. 
        </Typography>
        <Typography variant="h5" gutterBottom sx = {{mt: 2}}>Change Notes</Typography>
        <List>
            <ListItemText>2022-11-07: changed edit buttons to icons and added descending sort for data tables.</ListItemText>
            <ListItemText>2022-11-11: added basic line graph. Some styling.</ListItemText>
            <ListItemText>2022-11-16: styling fixes.</ListItemText>
            <ListItemText>2022-11-21: added notes field to points dashboard.</ListItemText>
            <ListItemText>2022-11-22: mobile styling fix and basic settings pane </ListItemText>
            <ListItemText>2022-11-27: Modal Stat Entry Pop Up, styling fixes, image src change. </ListItemText>
            <ListItemText>2022-11-28: Modal sharpenings pop up</ListItemText>
        </List>

        <Typography variant="h5" gutterBottom sx = {{mt: 2}}>Image Sources</Typography>
        <List>
            <ListItemText>Homepage image, <Link href ="https://unsplash.com/photos/XUwk3DG6jqg" target="_blank" rel="noopener">Foggy Skate</Link> by <Link href = "https://unsplash.com/@mroz" target ="_blank" rel ="noopener">Filip Mroz</Link> via unsplash.</ListItemText>
        </List>
    </section>
    )
}

import React from 'react';

//mui
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

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
        <Typography sx = {{}} variant="body1" gutterBottom>
            2022-11-07: changed edit buttons to icons and added descending sort for data tables. {' '}
        </Typography>

    </section>
    )
}

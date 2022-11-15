import React from 'react';
import {Typography, Link, Container } from '@mui/material';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary">
      {'Copyright © '}
      <Link color="inherit" href="/">
        Stat Tracker
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function StickyFooter() {

  return (
    <>
      {/* <CssBaseline /> */}
      <footer>
        <Container maxWidth="sm">
          <Typography variant="body1">Stat Tracker</Typography>
          <Copyright />
        </Container>
      </footer>
     </>
  );
}
